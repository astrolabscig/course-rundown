import LabShell from "@/components/econs/lab/LabShell";
import OutputGapLab from "@/components/econs/lab/OutputGapLab";

export default function OutputGapModulePage() {
  return (
    <LabShell
      moduleNumber={3}
      title="Output Gap"
      tagline="Watch Real GDP and Potential GDP side by side, with the gap between them shaded orange (inflationary) or blue (recessionary) as it opens and closes."
      prev={{ href: "/econs/lab/growth", label: "Module 2: Long-Run Growth" }}
    >
      <OutputGapLab />
    </LabShell>
  );
}
