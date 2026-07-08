import LabShell from "@/components/econs/lab/LabShell";
import BusinessCycleLab from "@/components/econs/lab/BusinessCycleLab";

export default function BusinessCycleModulePage() {
  return (
    <LabShell
      moduleNumber={1}
      title="Business Cycle"
      tagline="Watch Real GDP swing through expansion, peak, recession, and trough — then push the economy into a downturn or a recovery yourself."
      next={{ href: "/econs/lab/growth", label: "Module 2: Long-Run Growth" }}
    >
      <BusinessCycleLab />
    </LabShell>
  );
}
