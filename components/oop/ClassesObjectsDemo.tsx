"use client";

import { useState } from "react";
import Card from "../Card";
import CodeBlock from "../CodeBlock";
import OutputPanel from "../OutputPanel";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const code = `#include <iostream>
#include <string>

class Student {              // the blueprint (class)
public:
    std::string name;
    int age;

    void introduce() {
        std::cout << "Hi, I'm " << name << ", age " << age << "\\n";
    }
};

int main() {
    Student a;               // an object (instance)
    a.name = "Ama"; a.age = 20;
    a.introduce();

    Student b;               // an independent object
    b.name = "Kofi"; b.age = 22;
    b.introduce();
}`;

interface StudentObject {
  id: number;
  name: string;
  age: string;
}

export default function ClassesObjectsDemo() {
  const [objects, setObjects] = useState<StudentObject[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const nextId = objects.length > 0 ? objects[objects.length - 1].id + 1 : 1;

  function addObject(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !age.trim()) return;
    setObjects((prev) => [...prev, { id: nextId, name: name.trim(), age: age.trim() }]);
    setName("");
    setAge("");
    trackInteract();
  }

  const output =
    objects.length === 0
      ? "// Add an object below to see introduce() run"
      : objects.map((o) => `Hi, I'm ${o.name}, age ${o.age}`).join("\n");

  return (
    <Card
      id="concept-1"
      title="Concept 1 — Classes & Objects"
      situation="A class is a blueprint. Each object you create from it is an independent instance with its own data."
      why="A class is a blueprint; objects are instances that each hold their own data."
      examTip="The class doesn't store data — the objects do."
    >
      <ExplainerBox>
        <p>
          Think of a class like a cookie cutter, and objects like the actual cookies. The cutter
          (<span className="font-mono">Student</span>) defines the shape — what every cookie will
          have (a name, an age). Each cookie you actually cut out (each object) is real and separate:
          decorating one doesn&rsquo;t change any other cookie, even though they all came from the
          same cutter.
        </p>
      </ExplainerBox>

      <CodeBlock code={code} />

      <form onSubmit={addObject} className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="student-name" className="text-sm font-medium text-heading">
            Name
          </label>
          <input
            id="student-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ama"
            className="rounded-full border border-card-border px-3 py-1.5 text-sm w-36"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="student-age" className="text-sm font-medium text-heading">
            Age
          </label>
          <input
            id="student-age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="20"
            className="rounded-full border border-card-border px-3 py-1.5 text-sm w-24"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          Add object
        </button>
      </form>

      {objects.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Created Student objects">
          {objects.map((o) => (
            <li
              key={o.id}
              className="rounded-full border border-card-border bg-muted px-3 py-1.5 text-sm text-body"
            >
              Student <span className="font-mono">{String.fromCharCode(96 + o.id)}</span>: {o.name}, {o.age}
            </li>
          ))}
        </ul>
      )}

      <OutputPanel output={output} />
    </Card>
  );
}
