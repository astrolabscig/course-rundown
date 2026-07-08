import LabShell from "@/components/econs/lab/LabShell";
import GrowthLab from "@/components/econs/lab/GrowthLab";

export default function GrowthModulePage() {
  return (
    <LabShell
      moduleNumber={2}
      title="Long-Run Economic Growth"
      tagline="Reshape the economy's long-term trend by adjusting education, technology, investment, and infrastructure — no business-cycle wobble here, just the ceiling itself rising or falling."
      prev={{ href: "/econs/lab/business-cycle", label: "Module 1: Business Cycle" }}
      next={{ href: "/econs/lab/output-gap", label: "Module 3: Output Gap" }}
    >
      <GrowthLab />
    </LabShell>
  );
}
