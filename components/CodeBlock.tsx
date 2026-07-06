"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({ code }: { code: string }) {
  return (
    <div className="rounded-xl border border-card-border bg-code-bg overflow-hidden">
      <SyntaxHighlighter
        language="cpp"
        style={oneLight}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          fontSize: "0.875rem",
        }}
        codeTagProps={{
          style: { fontFamily: "var(--font-mono)" },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
