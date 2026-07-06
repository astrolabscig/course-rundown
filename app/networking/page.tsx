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
import MCQDrill from "@/components/drills/MCQDrill";
import ComparisonTable from "@/components/reference/ComparisonTable";
import { networkingCurriculum } from "@/lib/networking/curriculum";
import { networkingFundamentalsGroups } from "@/lib/networking/fundamentals";
import { networkingComparisonTables } from "@/lib/networking/comparisonTables";
import { networkingMcqBank } from "@/lib/networking/mcqBank";

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
      <TopBar />
      <div className="flex flex-1 mx-auto w-full max-w-[1280px]">
        <SyllabusRail parts={networkingCurriculum} storageKey="networking_visited_parts" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 space-y-12">
          <section className="space-y-2">
            <h1 className="text-3xl font-semibold text-heading">
              IT — Networking Fundamentals: understand, don&rsquo;t cram
            </h1>
            <p className="text-body max-w-2xl">
              Network basics, IPv4 addressing, and subnetting — with live calculators that show
              every step, not just the final answer, so the exam math actually makes sense.
            </p>
          </section>

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
            <PartHeading number="1" title="IPv4 & Address Classes" />
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

          <section id="n-part-2" className="space-y-6 scroll-mt-24">
            <PartHeading number="2" title="Subnet Masks & the AND Operation" />
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

          <section id="n-part-3" className="space-y-6 scroll-mt-24">
            <PartHeading number="3" title="Subnetting Calculator" />
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

          <section id="n-part-4" className="space-y-6 scroll-mt-24">
            <PartHeading number="4" title="FLSM & VLSM" />
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

          <section id="n-part-5" className="space-y-6 scroll-mt-24">
            <PartHeading number="5" title="CIDR" />
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-heading mb-1">CIDR block calculator</h3>
              <p className="text-body text-sm mb-4">
                Try this: change the prefix, or type an address that isn&rsquo;t block-aligned
                (like 144.16.192.30/29) to see the validity check catch it.
              </p>
              <CIDRCalculator />
            </div>
          </section>

          <section id="n-part-6" className="space-y-6 scroll-mt-24">
            <PartHeading number="6" title="Protocols & Media Access" />
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

          <section id="n-part-7" className="space-y-6 scroll-mt-24">
            <PartHeading number="7" title="TCP/IP & OSI Layering" />
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

          <section id="n-part-8" className="space-y-6 scroll-mt-24">
            <PartHeading number="8" title="Speed Tables" />
            <div className="space-y-4">
              {networkingComparisonTables.map((table) => (
                <ComparisonTable key={table.id} data={table} />
              ))}
            </div>
          </section>

          <section id="n-part-9" className="space-y-6 scroll-mt-24">
            <PartHeading number="9" title="Subnetting Drill" />
            <p className="text-sm text-secondary">
              Work out each scenario yourself first, then reveal the full worked answer — this is
              about understanding the steps, not just checking a final number.
            </p>
            <SubnettingDrill />
          </section>

          <section id="n-part-10" className="space-y-6 scroll-mt-24">
            <PartHeading number="10" title="MCQ Drill Bank" />
            <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6">
              <MCQDrill questions={networkingMcqBank} />
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
