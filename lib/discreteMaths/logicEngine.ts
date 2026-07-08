// A tiny propositional-logic parser/evaluator supporting the standard
// connectives (¬ ∧ ∨ → ↔) with the book's own precedence order
// (¬ highest, then ∧, then ∨, then →, then ↔ lowest), plus ASCII fallbacks
// (~ or ! for ¬, & for ∧, | for ∨, -> for →, <-> for ↔) so users can type
// on a normal keyboard.

export type Valuation = Record<string, boolean>;

export type Ast =
  | { kind: "var"; name: string }
  | { kind: "not"; child: Ast }
  | { kind: "and"; left: Ast; right: Ast }
  | { kind: "or"; left: Ast; right: Ast }
  | { kind: "implies"; left: Ast; right: Ast }
  | { kind: "iff"; left: Ast; right: Ast };

type TokenType = "VAR" | "NOT" | "AND" | "OR" | "IMPLIES" | "IFF" | "LPAREN" | "RPAREN";
interface Token {
  type: TokenType;
  text: string;
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const c = input[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (c === "(") {
      tokens.push({ type: "LPAREN", text: c });
      i++;
      continue;
    }
    if (c === ")") {
      tokens.push({ type: "RPAREN", text: c });
      i++;
      continue;
    }
    if (c === "¬" || c === "~" || c === "!") {
      tokens.push({ type: "NOT", text: c });
      i++;
      continue;
    }
    if (c === "∧" || c === "&") {
      tokens.push({ type: "AND", text: c });
      i++;
      continue;
    }
    if (c === "∨" || c === "|") {
      tokens.push({ type: "OR", text: c });
      i++;
      continue;
    }
    if (c === "↔") {
      tokens.push({ type: "IFF", text: c });
      i++;
      continue;
    }
    if (c === "→") {
      tokens.push({ type: "IMPLIES", text: c });
      i++;
      continue;
    }
    if (input.startsWith("<->", i)) {
      tokens.push({ type: "IFF", text: "<->" });
      i += 3;
      continue;
    }
    if (input.startsWith("->", i)) {
      tokens.push({ type: "IMPLIES", text: "->" });
      i += 2;
      continue;
    }
    if (/[a-zA-Z]/.test(c)) {
      tokens.push({ type: "VAR", text: c });
      i++;
      continue;
    }
    throw new Error(`Unexpected character '${c}' in expression.`);
  }
  return tokens;
}

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(type: TokenType): Token {
    const t = this.tokens[this.pos];
    if (!t || t.type !== type) {
      throw new Error(`Expected ${type} but found ${t ? t.text : "end of expression"}.`);
    }
    this.pos++;
    return t;
  }

  parse(): Ast {
    const node = this.parseIff();
    if (this.pos < this.tokens.length) {
      throw new Error(`Unexpected token '${this.tokens[this.pos].text}'.`);
    }
    return node;
  }

  private parseIff(): Ast {
    let left = this.parseImplies();
    while (this.peek()?.type === "IFF") {
      this.consume("IFF");
      const right = this.parseImplies();
      left = { kind: "iff", left, right };
    }
    return left;
  }

  private parseImplies(): Ast {
    let left = this.parseOr();
    while (this.peek()?.type === "IMPLIES") {
      this.consume("IMPLIES");
      const right = this.parseOr();
      left = { kind: "implies", left, right };
    }
    return left;
  }

  private parseOr(): Ast {
    let left = this.parseAnd();
    while (this.peek()?.type === "OR") {
      this.consume("OR");
      const right = this.parseAnd();
      left = { kind: "or", left, right };
    }
    return left;
  }

  private parseAnd(): Ast {
    let left = this.parseNot();
    while (this.peek()?.type === "AND") {
      this.consume("AND");
      const right = this.parseNot();
      left = { kind: "and", left, right };
    }
    return left;
  }

  private parseNot(): Ast {
    if (this.peek()?.type === "NOT") {
      this.consume("NOT");
      const inner = this.parseNot();
      return { kind: "not", child: inner };
    }
    return this.parseAtom();
  }

  private parseAtom(): Ast {
    const t = this.peek();
    if (!t) throw new Error("Unexpected end of expression.");
    if (t.type === "LPAREN") {
      this.consume("LPAREN");
      const inner = this.parseIff();
      this.consume("RPAREN");
      return inner;
    }
    if (t.type === "VAR") {
      this.consume("VAR");
      return { kind: "var", name: t.text };
    }
    throw new Error(`Unexpected token '${t.text}'.`);
  }
}

export function parseLogicAst(input: string): Ast {
  const tokens = tokenize(input);
  if (tokens.length === 0) throw new Error("Enter an expression.");
  return new Parser(tokens).parse();
}

export function evalAst(node: Ast, v: Valuation): boolean {
  switch (node.kind) {
    case "var":
      return Boolean(v[node.name]);
    case "not":
      return !evalAst(node.child, v);
    case "and":
      return evalAst(node.left, v) && evalAst(node.right, v);
    case "or":
      return evalAst(node.left, v) || evalAst(node.right, v);
    case "implies":
      return !evalAst(node.left, v) || evalAst(node.right, v);
    case "iff":
      return evalAst(node.left, v) === evalAst(node.right, v);
  }
}

export function astVars(node: Ast): Set<string> {
  switch (node.kind) {
    case "var":
      return new Set([node.name]);
    case "not":
      return astVars(node.child);
    default:
      return new Set([...astVars(node.left), ...astVars(node.right)]);
  }
}

export interface LogicNode {
  eval: (v: Valuation) => boolean;
  vars: Set<string>;
}

// Kept for the truth-table component: a closure-based view over the same AST.
export function parseLogicExpression(input: string): LogicNode {
  const ast = parseLogicAst(input);
  return { eval: (v) => evalAst(ast, v), vars: astVars(ast) };
}

export function allValuations(varNames: string[]): Valuation[] {
  const n = varNames.length;
  const rows: Valuation[] = [];
  for (let mask = 0; mask < 1 << n; mask++) {
    const v: Valuation = {};
    varNames.forEach((name, i) => {
      v[name] = Boolean((mask >> (n - 1 - i)) & 1);
    });
    rows.push(v);
  }
  return rows;
}
