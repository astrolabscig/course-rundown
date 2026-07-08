import type { ReactNode } from "react";
import Link from "next/link";
import TopBar from "../../TopBar";
import Footer from "../../Footer";

export interface ModuleNav {
  href: string;
  label: string;
}

export default function LabShell({
  moduleNumber,
  title,
  tagline,
  prev,
  next,
  children,
}: {
  moduleNumber: number;
  title: string;
  tagline: string;
  prev?: ModuleNav;
  next?: ModuleNav;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1">
      <TopBar showCredit />
      <main className="flex-1 mx-auto w-full max-w-[900px] px-4 sm:px-8 py-8 space-y-6">
        <div className="space-y-2">
          <Link href="/econs/lab" className="text-sm font-medium text-accent hover:underline">
            ◀ Back to Simulation Lab
          </Link>
          <h1 className="text-3xl font-semibold text-heading">
            Module {moduleNumber}: {title}
          </h1>
          <p className="text-body max-w-2xl">{tagline}</p>
        </div>

        {children}

        {(prev || next) && (
          <div className="flex items-center justify-between pt-4 border-t border-card-border">
            {prev ? (
              <Link href={prev.href} className="text-sm font-medium text-accent hover:underline">
                ◀ {prev.label}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={next.href} className="text-sm font-medium text-accent hover:underline">
                {next.label} ▶
              </Link>
            ) : (
              <span />
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
