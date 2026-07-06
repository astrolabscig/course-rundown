import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/adminSession";
import { sql, ensureTables, isDbConfigured } from "@/lib/db";
import LogoutButton from "@/components/admin/LogoutButton";

interface FeedbackRow {
  id: number;
  useful: string;
  comment: string | null;
  user_agent: string | null;
  created_at: string;
}

async function getStats() {
  if (!isDbConfigured()) {
    return {
      opens: 0,
      used: 0,
      yes: 0,
      no: 0,
      feedback: [] as FeedbackRow[],
      dbConfigured: false,
    };
  }

  await ensureTables();

  const [accessResult, feedbackCountResult, feedbackRowsResult] = await Promise.all([
    sql<{ opens: string; used: string }>`
      SELECT
        COUNT(*)::text AS opens,
        COUNT(*) FILTER (WHERE interacted)::text AS used
      FROM app_access
    `,
    sql<{ useful: string; count: string }>`
      SELECT useful, COUNT(*)::text AS count FROM feedback GROUP BY useful
    `,
    sql<FeedbackRow>`
      SELECT id, useful, comment, user_agent, created_at
      FROM feedback
      ORDER BY created_at DESC
    `,
  ]);

  const opens = Number(accessResult.rows[0]?.opens ?? 0);
  const used = Number(accessResult.rows[0]?.used ?? 0);
  const yes = Number(feedbackCountResult.rows.find((r) => r.useful === "yes")?.count ?? 0);
  const no = Number(feedbackCountResult.rows.find((r) => r.useful === "no")?.count ?? 0);

  return {
    opens,
    used,
    yes,
    no,
    feedback: feedbackRowsResult.rows,
    dbConfigured: true,
  };
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const valid = await verifyAdminSession(token);

  if (!valid) {
    redirect("/admin/login");
  }

  const { opens, used, yes, no, feedback, dbConfigured } = await getStats();
  const usageRate = opens > 0 ? Math.round((used / opens) * 100) : 0;

  return (
    <div className="flex-1 bg-muted">
      <div className="mx-auto max-w-[1040px] px-4 sm:px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-heading">Admin dashboard</h1>
          <LogoutButton />
        </div>

        {!dbConfigured && (
          <div className="rounded-lg border border-card-border bg-card p-4 text-sm text-secondary">
            POSTGRES_URL is not set — showing empty analytics.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total opens" value={opens} />
          <StatCard label="Total used" value={used} />
          <StatCard label="Usage rate" value={`${usageRate}%`} />
        </div>

        <div className="rounded-lg border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
          <h2 className="text-lg font-semibold text-heading mb-3">Feedback summary</h2>
          <div className="flex gap-6 text-sm text-body">
            <span>
              <span className="font-semibold text-success">{yes}</span> yes
            </span>
            <span>
              <span className="font-semibold text-error">{no}</span> no
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 overflow-x-auto">
          <h2 className="text-lg font-semibold text-heading mb-3">Feedback</h2>
          {feedback.length === 0 ? (
            <p className="text-sm text-secondary">No feedback yet.</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-card-border text-secondary">
                  <th className="py-2 pr-4 font-medium">Useful?</th>
                  <th className="py-2 pr-4 font-medium">Comment</th>
                  <th className="py-2 pr-4 font-medium">When</th>
                  <th className="py-2 pr-4 font-medium">User agent</th>
                </tr>
              </thead>
              <tbody>
                {feedback.map((row) => (
                  <tr key={row.id} className="border-b border-card-border align-top">
                    <td className="py-2 pr-4">
                      <span
                        className={
                          row.useful === "yes" ? "text-success font-medium" : "text-error font-medium"
                        }
                      >
                        {row.useful}
                      </span>
                    </td>
                    <td className="py-2 pr-4 max-w-xs whitespace-pre-wrap text-body">
                      {row.comment || <span className="text-secondary">—</span>}
                    </td>
                    <td className="py-2 pr-4 text-secondary whitespace-nowrap">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="py-2 pr-4 text-secondary max-w-xs truncate">{row.user_agent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
        {label}
      </div>
      <div className="text-2xl font-semibold text-heading">{value}</div>
    </div>
  );
}
