import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import SyllabusRail from "@/components/SyllabusRail";
import FeedbackForm from "@/components/FeedbackForm";
import Tracker from "@/components/Tracker";
import BasicsCheatsheet from "@/components/basics/BasicsCheatsheet";
import IPClassifier from "@/components/networking/IPClassifier";
import IPConfigSimulator from "@/components/networking/IPConfigSimulator";
import DHCPSimulator from "@/components/networking/DHCPSimulator";
import NATSimulator from "@/components/networking/NATSimulator";
import ANDOperationSimulator from "@/components/networking/ANDOperationSimulator";
import SubnetCalculator from "@/components/networking/SubnetCalculator";
import VLSMBuilder from "@/components/networking/VLSMBuilder";
import FLSMLab from "@/components/networking/FLSMLab";
import CIDRCalculator from "@/components/networking/CIDRCalculator";
import SubnettingDrill from "@/components/networking/SubnettingDrill";
import CollisionSimulator from "@/components/networking/CollisionSimulator";
import ARPSimulator from "@/components/networking/ARPSimulator";
import SwitchingSimulator from "@/components/networking/SwitchingSimulator";
import EncapsulationSimulator from "@/components/networking/EncapsulationSimulator";
import TCPHandshakeSimulator from "@/components/networking/TCPHandshakeSimulator";
import DNSSimulator from "@/components/networking/DNSSimulator";
import FirewallSimulator from "@/components/networking/FirewallSimulator";
import TopologySimulator from "@/components/networking/TopologySimulator";
import MCQDrill from "@/components/drills/MCQDrill";
import ComparisonTable from "@/components/reference/ComparisonTable";
import ExplainerBox from "@/components/ExplainerBox";
import { networkingCurriculum } from "@/lib/networking/curriculum";
import { networkingFundamentalsGroups } from "@/lib/networking/fundamentals";
import { networkSystemsFundamentalsGroups } from "@/lib/networking/networkSystemsFundamentals";
import { networkingComparisonTables } from "@/lib/networking/comparisonTables";
import { networkingMcqBank } from "@/lib/networking/mcqBank";
import { midsemBank } from "@/lib/networking/midsemBank";

function findNsGroup(id: string) {
  const group = networkSystemsFundamentalsGroups.find((g) => g.id === id);
  if (!group) throw new Error(`Missing network-systems group: ${id}`);
  return group;
}

const componentRoles: [string, string][] = [
  ["Computer", "Generates or receives user data"],
  ["Switch", "Connects devices within the LAN"],
  ["Router", "Connects the LAN to other networks"],
  ["Modem/ONT", "Terminates the communication service provided by the ISP, depending on access technology"],
  ["ISP", "Provides connectivity to the wider Internet"],
];

const internetAccessSteps = [
  "Your computer generates a request.",
  "The local network carries the request towards the router.",
  "The router forwards the packet outside the local network.",
  "The ISP provides connectivity to other networks.",
  "Routers across interconnected networks forward the packet towards its destination.",
  "The destination server responds.",
  "The response travels back through networks towards your computer.",
];

const topologyComparisonRows: [string, string, string, string][] = [
  ["Arrangement", "Shared backbone", "Central device", "Circular connection"],
  ["Cable requirement", "Relatively low", "Relatively high", "Moderate"],
  ["Troubleshooting", "More difficult", "Easier", "More difficult"],
  ["Important failure point", "Backbone", "Central device", "Link/device in a simple ring"],
  ["Adding devices", "Can be disruptive", "Relatively easy", "Can be difficult"],
  ["Modern LAN use", "Uncommon", "Very common", "Uncommon"],
];

const specialAddresses: [string, string][] = [
  ["0.0.0.0", "\"This network/host\" — a placeholder, not a real assignable address."],
  ["127.0.0.0 – 127.255.255.255", "Loopback — always refers back to the same device."],
  ["10.0.0.0 – 10.255.255.255", "Private (class A range) — not routed on the public Internet."],
  ["172.16.0.0 – 172.31.255.255", "Private (class B range)."],
  ["192.168.0.0 – 192.168.255.255", "Private (class C range) — the common home-router range."],
  ["169.254.0.0 – 169.254.255.255", "Link-local (APIPA) — a device gives itself one of these when DHCP fails."],
  ["255.255.255.255", "Limited broadcast — reaches every device on the local network."],
];

function PartHeading({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="flex items-center gap-3 border-b border-card-border pb-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted font-mono text-sm font-bold text-accent border border-card-border">
        {number}
      </span>
      <span className="text-2xl font-semibold text-heading">{title}</span>
    </h2>
  );
}

export default function NetworkingRoom() {
  return (
    <div className="flex flex-col flex-1">
      <Tracker />
      <TopBar showCredit />
      <div className="flex flex-col md:flex-row flex-1 mx-auto w-full max-w-[1280px]">
        <SyllabusRail parts={networkingCurriculum} storageKey="networking_visited_parts" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 space-y-12">
          <section className="space-y-2">
            <h1 className="text-3xl font-semibold text-heading">
              IT — Networking Fundamentals: understand, don&rsquo;t cram
            </h1>
            <p className="text-body max-w-2xl">
              Network components, topologies, scalable design, security, IPv4 addressing, and
              subnetting — with live calculators and simulators that show every step, not just the
              final answer, so the exam actually makes sense.
            </p>
          </section>

          <a
            href="/networking/group-assignment"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-accent/10 px-5 py-4 hover:border-accent transition-colors"
          >
            <div>
              <p className="text-sm font-semibold text-accent">CSM 152 Group Assignment →</p>
              <p className="text-sm text-body mt-0.5">
                Client-server architecture, server models, Berkeley sockets, and DNS — the full
                assignment broken down activity by activity, with live simulators for every
                concept and a step-by-step guide to the evidence you need to gather yourself.
              </p>
            </div>
            <span className="shrink-0 px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium">
              Open assignment
            </span>
          </a>

          <section id="n-part-0" className="space-y-6 scroll-mt-24">
            <PartHeading number="0" title="Networking Fundamentals" />
            <p className="text-sm text-secondary">
              Click a topic to expand it. Real-world analogies first, then the terms you&rsquo;ll
              actually see on the exam.
            </p>
            <BasicsCheatsheet groups={networkingFundamentalsGroups} />

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-1">DNS: turning names into addresses</h3>
              <p className="text-body text-sm mb-4">
                Try this: hit Play and follow the resolver's chain from root to TLD to
                authoritative server.
              </p>
              <DNSSimulator />
            </div>

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-1">Firewall rules in action</h3>
              <p className="text-body text-sm mb-4">
                Try this: fire a few of the preset packets and see which rule catches each one —
                including the ones nothing explicitly allows.
              </p>
              <FirewallSimulator />
            </div>
          </section>

          <section id="n-part-1" className="space-y-6 scroll-mt-24">
            <PartHeading number="1" title="Network Components & Architecture" />
            <p className="text-sm text-secondary">
              Every device a network is actually built from — end devices, NICs, switches,
              routers, access points, servers, and the modem/ONT that hands off to your ISP —
              plus how they all fit together into one working network.
            </p>
            <BasicsCheatsheet groups={[findNsGroup("what-is-a-network"), findNsGroup("network-devices")]} />

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6 space-y-4">
              <h3 className="text-lg font-semibold text-heading">Putting the components together</h3>
              <ExplainerBox title="Think about it">
                What would happen if the switch failed? What if the router failed? What if the
                Internet connection failed? What if one computer&rsquo;s Ethernet cable failed?
                (Answer these with the topology simulator in the next part.)
              </ExplainerBox>
              <div className="rounded-xl bg-muted p-4 sm:p-6 space-y-3 font-mono text-sm text-center">
                <p className="font-semibold text-heading">INTERNET</p>
                <p className="text-secondary">↕</p>
                <p className="text-body">ISP</p>
                <p className="text-secondary">↕</p>
                <p className="text-body">Modem / ONT</p>
                <p className="text-secondary">↕</p>
                <p className="text-body">Router</p>
                <p className="text-secondary">↕</p>
                <p className="text-body">Switch</p>
                <p className="text-secondary">↕</p>
                <p className="text-body">PC1 · PC2 · Server · Printer</p>
                <p className="text-secondary">↕ (from Server)</p>
                <p className="text-body">Access Point</p>
                <p className="text-secondary">↕</p>
                <p className="text-body">Laptop · Phone · Tablet</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Component</th>
                      <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {componentRoles.map(([c, r]) => (
                      <tr key={c} className="border-b border-card-border last:border-0">
                        <td className="p-2 font-mono text-heading whitespace-nowrap align-top">{c}</td>
                        <td className="p-2 text-body align-top">{r}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-3">What happens when you access the Internet?</h3>
              <ol className="space-y-1.5 list-decimal list-inside">
                {internetAccessSteps.map((s) => (
                  <li key={s} className="text-sm text-body">{s}</li>
                ))}
              </ol>
              <p className="text-xs text-secondary mt-3">Key idea: the Internet is a network of interconnected networks.</p>
            </div>
          </section>

          <section id="n-part-2" className="space-y-6 scroll-mt-24">
            <PartHeading number="2" title="Network Topologies" />
            <p className="text-sm text-secondary">
              Bus, star, and ring — how they&rsquo;re arranged, their trade-offs, and exactly what
              breaks (and what doesn&rsquo;t) when a device or link fails in each one.
            </p>
            <BasicsCheatsheet groups={[findNsGroup("network-topologies")]} />

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-1">Topology failure simulator</h3>
              <p className="text-body text-sm mb-4">
                Try this: switch between bus, star, and ring, then fail the shared point (backbone
                / central switch / a ring link) versus one device&rsquo;s own connection, and watch
                exactly who loses connectivity.
              </p>
              <TopologySimulator />
            </div>

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-3">Comparing the three topologies</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Characteristic</th>
                      <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Bus</th>
                      <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Star</th>
                      <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Ring</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topologyComparisonRows.map(([characteristic, bus, star, ring]) => (
                      <tr key={characteristic} className="border-b border-card-border last:border-0">
                        <td className="p-2 font-semibold text-heading align-top whitespace-nowrap">{characteristic}</td>
                        <td className="p-2 text-body align-top">{bus}</td>
                        <td className="p-2 text-body align-top">{star}</td>
                        <td className="p-2 text-body align-top">{ring}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section id="n-part-3" className="space-y-6 scroll-mt-24">
            <PartHeading number="3" title="Scalability & Network Design" />
            <p className="text-sm text-secondary">
              How to design a network that satisfies today&rsquo;s requirements without needing a
              rebuild the moment it grows — plus the exact answer structure exam questions expect.
            </p>
            <BasicsCheatsheet groups={[findNsGroup("scalability-and-design")]} />

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6 space-y-3">
              <h3 className="text-lg font-semibold text-heading">
                Worked example: a 40-computer lab with a printer, a server, and Internet access
              </h3>
              <div className="space-y-2">
                {[
                  ["1. Topology", "Star — easy to add computers, individual connection faults can be isolated, and modern Ethernet switches support efficient communication."],
                  ["2. Central device", "An appropriately sized switch, or a combination of switches."],
                  ["3. Transmission medium", "Twisted-pair Ethernet cable connecting desktop computers to the switch."],
                  ["4. Internet connectivity", "Connect the LAN through a router and the appropriate ISP termination equipment (modem/ONT)."],
                  ["5. Scalability", "Allow for additional computers, switch ports, future wireless access, and additional bandwidth."],
                  ["6. Security", "Strong authentication, appropriate firewall controls, malware protection, regular software updates, user security awareness, and regular backups."],
                ].map(([step, detail]) => (
                  <div key={step} className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-semibold text-heading">{step}</p>
                    <p className="text-sm text-body">{detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6 space-y-3">
              <h3 className="text-lg font-semibold text-heading">
                Authentic learning activity, fully worked: the 50-to-70-computer ICT lab
              </h3>
              <p className="text-sm text-body">
                Scenario: an ICT lab starting with 50 desktop computers, two network printers, one
                file server, Wi-Fi access for lecturers, and Internet access — expected to grow to
                70 computers within three years, used for web browsing, online examinations, cloud
                services, downloading lecture materials, and shared files.
              </p>
              <div className="space-y-2">
                {[
                  ["Topology", "Star topology. Each computer gets an independent connection to the switch, so a fault on one cable never takes down the exam session for everyone else — critical given online examinations are part of the workload — and adding the extra 20 computers later only means running new cables to free switch ports, not redesigning anything."],
                  ["Devices required", "One or more Ethernet switches (with spare ports for growth), a router, modem/ONT, one or more wireless access points (for lecturer Wi-Fi), one file server, and two network printers connected into the switch like any other end device."],
                  ["Transmission media", "Twisted-pair Ethernet for the 50 (soon 70) fixed desktop computers — inexpensive and easy to install at this scale — and Wi-Fi via access points specifically for the lecturers who need mobile access, not the fixed desktops."],
                  ["Internet connectivity", "The switch feeds into a router, which connects to the ISP's modem/ONT, which terminates the ISP's actual service — the same Computer → Switch → Router → Modem/ONT → ISP → Internet chain as any other design."],
                  ["Future expansion", "Choose a switch (or switches) with enough spare ports for the 20 additional computers now, rather than buying an exactly-sized switch that would need full replacement later; leave headroom in the IP addressing scheme and confirm the Internet connection's bandwidth can absorb 70 concurrent users rather than 50."],
                  ["Security measures", "Strong, unique passwords and multi-factor authentication where available for staff/admin access; a firewall between the LAN and the router/Internet connection; malware protection and regular software updates on every machine; regular backups of the file server; and basic Internet-safety and phishing awareness for students using the lab for online exams."],
                  ["Bandwidth requirements", "Online examinations, cloud services, and downloading lecture materials are all listed as significant bandwidth consumers — the connection needs to comfortably support up to 70 concurrent users doing this simultaneously, not just 50, since the design must hold up after the planned expansion, not only on day one."],
                ].map(([label, detail]) => (
                  <div key={label} className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-semibold text-heading">{label}</p>
                    <p className="text-sm text-body">{detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6 space-y-3">
              <h3 className="text-lg font-semibold text-heading">Challenge activity, fully worked: bus vs star</h3>
              <p className="text-sm text-body">
                Designer A recommends bus topology because it requires less cable. Designer B
                recommends star topology because each computer connects independently to a central
                switch.
              </p>
              <p className="text-sm text-body">
                <strong className="text-heading">Recommendation: star.</strong> Its advantages —
                easy fault isolation, easy addition of devices, good performance with switches —
                directly serve a lab that expects growth and needs to stay usable while individual
                faults are fixed. Its disadvantage (more cabling than bus) is a one-time cost, not a
                recurring operational risk.
              </p>
              <p className="text-sm text-body">
                <strong className="text-heading">Disadvantages that still remain:</strong> the
                central switch is now a single point of failure for the whole lab, and star does
                need more upfront cabling than bus.
              </p>
              <p className="text-sm text-body">
                <strong className="text-heading">Effect of growth from 50 to 70 computers:</strong>{" "}
                this strengthens the case for star. Bus topology&rsquo;s main advantage (less cable)
                matters less as the network grows, while its main weakness (a single backbone
                failure disabling every device) becomes more costly the more devices depend on that
                one shared cable. Star&rsquo;s ability to add devices without disrupting the
                existing network is exactly what a planned expansion needs.
              </p>
              <p className="text-sm text-body">
                <strong className="text-heading">If cost were the dominant constraint:</strong> bus
                topology&rsquo;s lower cabling cost becomes more tempting for a very small,
                budget-constrained, non-critical network. But for an institution running online
                examinations — where a single backbone failure could disrupt an entire cohort
                mid-exam — the reliability and fault-isolation case for star still outweighs the
                extra cable cost in most realistic scenarios. The honest exam answer is to state
                this trade-off explicitly, not to pretend cost has no effect on the decision at all.
              </p>
            </div>
          </section>

          <section id="n-part-4" className="space-y-6 scroll-mt-24">
            <PartHeading number="4" title="Network Security & Internet Safety" />
            <p className="text-sm text-secondary">
              Passwords, phishing, malware, backups, and personal-device security — the practical,
              everyday side of keeping a network (and yourself) safe.
            </p>
            <BasicsCheatsheet groups={[findNsGroup("network-security-and-safety")]} />
          </section>

          <section id="n-part-5" className="space-y-6 scroll-mt-24">
            <PartHeading number="5" title="IPv4 & Address Classes" />
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-heading mb-1">IP address classifier</h3>
                <p className="text-body text-sm">
                  Try this: type an address and watch its class, binary form, and network/host
                  split update live. Try 10.0.0.20 (class A), 144.16.72.57 (class B), and
                  192.203.17.5 (class C) to see the split move.
                </p>
              </div>
              <IPClassifier />
            </div>

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-3">Special-purpose addresses</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    {specialAddresses.map(([range, desc]) => (
                      <tr key={range} className="border-b border-card-border last:border-0">
                        <td className="p-2 font-mono text-heading whitespace-nowrap align-top">
                          {range}
                        </td>
                        <td className="p-2 text-body align-top">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-1">
                IP configuration & troubleshooting simulator
              </h3>
              <p className="text-body text-sm mb-4">
                Try this: hit a preset like &ldquo;Wrong gateway&rdquo; or &ldquo;Duplicate
                IP&rdquo;, then Test connection and read the diagnosis.
              </p>
              <IPConfigSimulator />
            </div>

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-1">
                DHCP: how a device gets its IP automatically
              </h3>
              <p className="text-body text-sm mb-4">
                Try this: hit Play to watch the DORA handshake, then see what an exhausted address
                pool looks like.
              </p>
              <DHCPSimulator />
            </div>

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-1">
                NAT: sharing one public IP
              </h3>
              <p className="text-body text-sm mb-4">
                Try this: send requests from more than one client and watch the NAT table grow.
              </p>
              <NATSimulator />
            </div>
          </section>

          <section id="n-part-6" className="space-y-6 scroll-mt-24">
            <PartHeading number="6" title="Subnet Masks & the AND Operation" />
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-1">
                Live AND-operation simulator
              </h3>
              <p className="text-body text-sm mb-4">
                Try this: change the mask from 255.255.0.0 to 255.255.192.0 (or click the preset)
                and watch which bits survive the AND — and how the network address changes.
              </p>
              <ANDOperationSimulator />
            </div>
          </section>

          <section id="n-part-7" className="space-y-6 scroll-mt-24">
            <PartHeading number="7" title="Subnetting Calculator" />
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-1">
                Full step-by-step subnet calculator
              </h3>
              <p className="text-body text-sm mb-4">
                Try this: enter an address and a prefix (or a dotted mask) and see the network
                address, broadcast address, usable host range, and subnet count worked out step
                by step — the same way you&rsquo;d be expected to show it on the exam.
              </p>
              <SubnetCalculator />
            </div>
          </section>

          <section id="n-part-8" className="space-y-6 scroll-mt-24">
            <PartHeading number="8" title="FLSM & VLSM" />
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-1">FLSM lab</h3>
              <p className="text-body text-sm mb-4">
                Try this: pick a prefix that satisfies both requirements, click Check, and use the
                hints to correct a wrong guess rather than just seeing the answer.
              </p>
              <FLSMLab />
            </div>
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <VLSMBuilder />
            </div>
          </section>

          <section id="n-part-9" className="space-y-6 scroll-mt-24">
            <PartHeading number="9" title="CIDR" />
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-1">CIDR block calculator</h3>
              <p className="text-body text-sm mb-4">
                Try this: change the prefix, or type an address that isn&rsquo;t block-aligned
                (like 144.16.192.30/29) to see the validity check catch it.
              </p>
              <CIDRCalculator />
            </div>
          </section>

          <section id="n-part-10" className="space-y-6 scroll-mt-24">
            <PartHeading number="10" title="Protocols & Media Access" />
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-1">
                Watch collisions happen — and get avoided
              </h3>
              <p className="text-body text-sm mb-4">
                Try this: hit Play on each scenario and watch the signals actually travel and
                collide, then watch the fix play out.
              </p>
              <CollisionSimulator />
            </div>

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-1">ARP: from IP to MAC</h3>
              <p className="text-body text-sm mb-4">
                Try this: hit Play and watch Host A's ARP cache go from empty to populated.
              </p>
              <ARPSimulator />
            </div>

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-1">
                Switching & MAC address learning
              </h3>
              <p className="text-body text-sm mb-4">
                Try this: hit Play and watch the CAM table fill in, and notice when the switch
                floods versus forwards to just one port.
              </p>
              <SwitchingSimulator />
            </div>
          </section>

          <section id="n-part-11" className="space-y-6 scroll-mt-24">
            <PartHeading number="11" title="TCP/IP & OSI Layering" />
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-heading mb-1">
                  Watch a message travel down, across, and back up the stack
                </h3>
                <p className="text-body text-sm">
                  Try this: hit Play and watch the data gain a header at every layer going down,
                  cross the wire, then lose each header again going up at the other end — TCP/IP&rsquo;s
                  4-layer model in motion (in place of OSI&rsquo;s fuller 7-layer model).
                </p>
              </div>
              <EncapsulationSimulator />
            </div>

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-3">What IP, TCP, and UDP each do</h3>
              <ul className="space-y-2">
                <li className="text-sm text-body flex gap-2">
                  <span className="text-accent shrink-0">•</span>
                  <span>
                    <strong className="text-heading">IP</strong> gets packets from source to
                    destination and handles routing — but it&rsquo;s unreliable: packets can be
                    lost, arrive out of order, or be duplicated.
                  </span>
                </li>
                <li className="text-sm text-body flex gap-2">
                  <span className="text-accent shrink-0">•</span>
                  <span>
                    <strong className="text-heading">TCP</strong> sits on top of IP and adds
                    reliability: it splits messages into packets, reassembles them in order, and
                    resends anything lost — at the cost of extra overhead and setup time.
                  </span>
                </li>
                <li className="text-sm text-body flex gap-2">
                  <span className="text-accent shrink-0">•</span>
                  <span>
                    <strong className="text-heading">UDP</strong> also sits on IP but skips all
                    that: no splitting, no resending, no guaranteed order — simpler and faster,
                    good for small messages like a DNS query where speed matters more than
                    guaranteed delivery.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-1">
                TCP&rsquo;s three-way handshake vs UDP
              </h3>
              <p className="text-body text-sm mb-4">
                Try this: play the handshake normally, then tick the box to lose the final ACK and
                watch TCP recover — then send a UDP packet and lose it, and notice nothing recovers
                automatically.
              </p>
              <TCPHandshakeSimulator />
            </div>
          </section>

          <section id="n-part-12" className="space-y-6 scroll-mt-24">
            <PartHeading number="12" title="Speed Tables" />
            <div className="space-y-4">
              {networkingComparisonTables.map((table) => (
                <ComparisonTable key={table.id} data={table} />
              ))}
            </div>
          </section>

          <section id="n-part-13" className="space-y-6 scroll-mt-24">
            <PartHeading number="13" title="Subnetting Drill" />
            <p className="text-sm text-secondary">
              Work out each scenario yourself first, then reveal the full worked answer — this is
              about understanding the steps, not just checking a final number.
            </p>
            <SubnettingDrill />
          </section>

          <section id="n-part-14" className="space-y-6 scroll-mt-24">
            <PartHeading number="14" title="MCQ Drill Bank" />
            <p className="text-sm text-secondary">
              {networkingMcqBank.length} questions: network components, topologies, scalability,
              design justification, security & Internet safety, subnetting and protocol mechanics,
              plus a set connecting each concept straight to its computer science application.
            </p>
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <MCQDrill questions={networkingMcqBank} />
            </div>
          </section>

          <section id="n-part-15" className="space-y-6 scroll-mt-24">
            <PartHeading number="15" title="CSM 152 Midsem Quiz" />
            <p className="text-sm text-secondary">
              All {midsemBank.length} questions from a real KNUST CSM 152 mid-semester exam paper,
              including the full practical subnetting scenario at the end — answer, see it marked
              instantly, then read the explanation.
            </p>
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <MCQDrill questions={midsemBank} />
            </div>
          </section>

          <section id="feedback" className="scroll-mt-24 max-w-2xl">
            <FeedbackForm />
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
