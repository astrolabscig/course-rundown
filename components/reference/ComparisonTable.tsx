import type { ComparisonTableData } from "@/lib/comparisonTables";

export default function ComparisonTable({ data }: { data: ComparisonTableData }) {
  return (
    <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
      <h4 className="text-base font-semibold text-heading mb-3">{data.title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 text-heading font-semibold border-b border-card-border">
                {data.columns[0]}
              </th>
              <th className="text-left p-2 text-heading font-semibold border-b border-card-border">
                {data.columns[1]}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr key={i} className="border-b border-card-border last:border-0">
                <td className="p-2 text-body align-top">{row[0]}</td>
                <td className="p-2 text-body align-top">{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
