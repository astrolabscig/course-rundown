import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { labModules } from "@/lib/econs/lab/modules";

export default function EconsLabIndexPage() {
  return (
    <div className="flex flex-col flex-1">
      <TopBar showCredit />
      <main className="flex-1 mx-auto w-full max-w-[1040px] px-4 sm:px-8 py-12">
        <section className="space-y-2 mb-10">
          <Link href="/econs" className="text-sm font-medium text-accent hover:underline">
            ◀ Back to Economics II
          </Link>
          <h1 className="text-3xl font-semibold text-heading">Simulation Lab</h1>
          <p className="text-body max-w-2xl">
            One concept, one simulation, one graph at a time — build up your understanding of the
            business cycle and economic growth piece by piece, then connect the ideas as you go.
          </p>
        </section>

        <div className="grid gap-5 sm:grid-cols-2">
          {labModules.map((m) =>
            m.href ? (
              <Link
                key={m.number}
                href={m.href}
                className="group rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] hover:border-accent transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl" aria-hidden="true">
                    {m.icon}
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-accent">
                    Module {m.number}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-heading mb-1 group-hover:text-accent transition-colors">
                  {m.title}
                </h2>
                <p className="text-body text-sm">{m.teaser}</p>
              </Link>
            ) : (
              <div key={m.number} className="rounded-2xl border border-dashed border-card-border p-5 opacity-60">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl" aria-hidden="true">
                    {m.icon}
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-secondary">
                    Module {m.number}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-heading mb-1">{m.title}</h2>
                <p className="text-body text-sm mb-2">{m.teaser}</p>
                <span className="text-xs font-semibold text-secondary">Coming soon</span>
              </div>
            )
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
