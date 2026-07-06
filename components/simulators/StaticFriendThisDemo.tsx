"use client";

import { useRef, useState } from "react";
import CodeBlock from "../CodeBlock";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const code = `class Student {
    static int count;              // shared across ALL Student objects — only ONE of these exists

public:
    std::string name;              // each object gets its OWN copy of this

    Student(std::string n) : name(n) {
        count++;                   // every construction bumps the one shared counter
    }

    static int getCount() {        // static method: no "this", can't touch non-static members
        return count;
    }

    void greet() {
        std::cout << "Hi, I'm " << this->name << "\\n";   // "this" = pointer to the calling object
    }
};

int Student::count = 0;   // static members must be defined once, outside the class

class Registrar {
public:
    friend class Student;   // (illustrative) a friend class/function gets access to privates
};`;

interface StudentObj {
  id: number;
  name: string;
}

export default function StaticFriendThisDemo() {
  const [students, setStudents] = useState<StudentObj[]>([]);
  const [name, setName] = useState("");
  const [greeted, setGreeted] = useState<number | null>(null);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function addStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const nextId = students.length > 0 ? students[students.length - 1].id + 1 : 1;
    setStudents((prev) => [...prev, { id: nextId, name: name.trim() }]);
    setName("");
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="static, this, and friend — what do they actually mean?">
        <p>
          A regular member variable is like each student having their OWN notebook — write in
          one, the others are untouched. A <span className="font-mono">static</span> member is
          like one shared notice board bolted to the classroom wall — there&rsquo;s only ever
          ONE, and every student writing on it changes the same board everyone else sees.
        </p>
        <p>
          <span className="font-mono">this</span> is simply &ldquo;whichever object called this
          method right now&rdquo; — a hidden pointer every non-static method secretly receives, so{" "}
          <span className="font-mono">this-&gt;name</span> always means THAT object&rsquo;s name,
          not some other student&rsquo;s.
        </p>
        <p>
          A <span className="font-mono">friend</span> function or class is like handing a trusted
          outsider a spare key to one specific room in your house — they can reach your private
          data without you having to make that data public to everyone.
        </p>
      </ExplainerBox>

      <CodeBlock code={code} />

      <form onSubmit={addStudent} className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="static-demo-name" className="text-sm font-medium text-heading">
            Name
          </label>
          <input
            id="static-demo-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Kofi"
            className="rounded-full border border-card-border px-3 py-1.5 text-sm w-36"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          new Student(name)
        </button>
      </form>

      <div className="rounded-2xl border border-card-border bg-muted p-4 space-y-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
            Student::count — one shared box for every object
          </div>
          <div className="inline-block rounded-lg border-2 border-accent-warm bg-white px-4 py-2 font-mono text-sm font-semibold text-heading">
            count = {students.length}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
            Each object&rsquo;s own name (click one to call greet())
          </div>
          {students.length === 0 ? (
            <p className="text-sm text-secondary">No students yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {students.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setGreeted(s.id);
                    markInteracted();
                  }}
                  className={`rounded-lg border-2 px-3 py-2 text-sm font-mono transition-colors ${
                    greeted === s.id ? "border-success bg-white text-success" : "border-accent bg-white text-heading hover:bg-muted"
                  }`}
                >
                  name = &quot;{s.name}&quot;
                </button>
              ))}
            </div>
          )}
        </div>

        {greeted !== null && (
          <div className="rounded-lg bg-[#1f1f1f] text-[#e8e8e8] font-mono text-sm p-3">
            Hi, I&rsquo;m {students.find((s) => s.id === greeted)?.name}
          </div>
        )}
      </div>
    </div>
  );
}
