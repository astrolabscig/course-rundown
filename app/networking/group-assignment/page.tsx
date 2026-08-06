import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ExplainerBox from "@/components/ExplainerBox";
import ComparisonTable from "@/components/reference/ComparisonTable";
import ServerModelSimulator from "@/components/networking/ServerModelSimulator";
import SocketSequenceStoryboard from "@/components/networking/SocketSequenceStoryboard";
import DNSSimulator from "@/components/networking/DNSSimulator";
import { networkingComparisonTables } from "@/lib/networking/comparisonTables";

function findTable(id: string) {
  const table = networkingComparisonTables.find((t) => t.id === id);
  if (!table) throw new Error(`Missing comparison table: ${id}`);
  return table;
}

function ActivityHeading({
  number,
  title,
  marks,
}: {
  number: string;
  title: string;
  marks: number;
}) {
  return (
    <h2 id={`activity-${number}`} className="flex flex-wrap items-center gap-3 border-b border-card-border pb-3 scroll-mt-24">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted font-mono text-sm font-bold text-accent border border-card-border">
        {number}
      </span>
      <span className="text-2xl font-semibold text-heading">{title}</span>
      <span className="ml-auto shrink-0 rounded-full bg-accent/10 text-accent text-xs font-semibold px-3 py-1">
        {marks} marks
      </span>
    </h2>
  );
}

function DoItYourself({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-accent-warm bg-accent-warm-bg p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-warm mb-1.5">
        This part must be your own, original work
      </p>
      <div className="text-sm text-body space-y-2 leading-relaxed">{children}</div>
    </div>
  );
}

const toc = [
  { href: "#framing", label: "How to use this page" },
  { href: "#roles", label: "Team roles & safety rule" },
  { href: "#activity-1", label: "Activity 1 — Client-server exchange" },
  { href: "#activity-2", label: "Activity 2 — Server model" },
  { href: "#activity-3", label: "Activity 3 — Berkeley sockets" },
  { href: "#activity-4", label: "Activity 4 — DNS investigation" },
  { href: "#activity-5", label: "Activity 5 — Telnet/FTP decision" },
  { href: "#activity-6", label: "Activity 6 — Recovery plan & reflection" },
  { href: "#portfolio", label: "Required submission checklist" },
  { href: "#rubric", label: "Rubric, translated" },
  { href: "#self-check", label: "Final self-check" },
];

export default function GroupAssignmentPage() {
  return (
    <div className="flex flex-col flex-1">
      <TopBar showCredit />
      <main className="flex-1 mx-auto w-full max-w-[900px] px-4 sm:px-8 py-8 space-y-14">
        <section className="space-y-2">
          <Link href="/networking" className="text-sm font-medium text-accent hover:underline">
            ◀ Back to IT — Networking
          </Link>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            CSM 152 · Authentic Performance Assignment · Group Assignment
          </p>
          <h1 className="text-3xl font-semibold text-heading">
            Restoring the CS Department&rsquo;s Network Services
          </h1>
          <p className="text-body max-w-2xl">
            The full CSM 152 client-server assignment, broken down activity by activity: every
            concept explained in depth, every calculation and diagram worked through step by step,
            and a live simulator for the parts that are really about understanding a mechanism
            rather than personally observing one.
          </p>
        </section>

        <section id="framing" className="scroll-mt-24 space-y-3">
          <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5 space-y-3">
            <h2 className="text-lg font-semibold text-heading">How to use this page</h2>
            <p className="text-sm text-body">
              This assignment is deliberately built as an <em>authentic</em> investigation: it asks
              for diagrams your group actually draws, terminal output your group actually captures
              on your own machine, and a personal reflection each of you actually writes — not
              generic facts you could look up. The instructions explicitly say a copied diagram
              &ldquo;earns no evidence marks,&rdquo; and the demonstration requires every member to
              explain a piece of evidence out loud, from memory, without reading the report.
            </p>
            <p className="text-sm text-body">
              So this page does two different things, and it&rsquo;s worth knowing which is which
              as you go:
            </p>
            <ul className="text-sm text-body space-y-1.5 list-disc list-inside">
              <li>
                For everything that&rsquo;s really a <strong className="text-heading">concept to understand or a calculation to work through</strong> —
                the server-model timing, the socket call sequence, the DNS mechanics, the incident
                diagnosis, the protocol comparison — this page gives you the full, detailed,
                worked-through answer, plus a live simulator you can experiment with. Learn it here,
                then explain it in your own words in your report.
              </li>
              <li>
                For everything that&rsquo;s <strong className="text-heading">personal, original evidence</strong> —
                your Activity 1 diagram of your own chosen service, your Activity 4B command
                captures, your Activity 5 screenshots, your Activity 6 reflection — you&rsquo;ll see
                a highlighted{" "}
                <span className="font-semibold text-accent-warm">&ldquo;must be your own, original work&rdquo;</span>{" "}
                box with the exact commands to run and exactly what to look for, so you can produce
                it yourself in minutes, correctly, the first time.
              </li>
            </ul>
            <p className="text-sm text-body">
              That split isn&rsquo;t a limitation — it&rsquo;s the fastest path to actually
              understanding this material well enough to survive the five-minute briefing where you
              have to explain your own evidence unaided.
            </p>
          </div>

          <nav className="rounded-2xl border border-card-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-2">On this page</p>
            <div className="grid gap-1 sm:grid-cols-2">
              {toc.map((t) => (
                <a key={t.href} href={t.href} className="text-sm text-accent hover:underline">
                  {t.label}
                </a>
              ))}
            </div>
          </nav>
        </section>

        <section id="roles" className="scroll-mt-24 space-y-4">
          <h2 className="text-xl font-semibold text-heading">Team roles & the safety rule</h2>
          <p className="text-sm text-body">
            The brief suggests five roles (service analyst, server-model analyst, socket analyst,
            DNS investigator, security/evidence lead) for a 4-5 person group, with a note that
            smaller groups should combine the service-analyst and security/evidence-lead roles.
            Whoever leads a role should still make sure the whole group understands that section
            well enough to answer questions on it — the rubric grades &ldquo;balanced
            participation,&rdquo; not just who wrote which paragraph.
          </p>
          <div className="rounded-xl bg-error-bg p-4">
            <p className="text-sm font-semibold text-error mb-1">Safety rule — non-negotiable</p>
            <p className="text-sm text-body">
              Never type a real username or password into Telnet, FTP, an unfamiliar website, or a
              public server. Every demonstration below either uses Cisco Packet Tracer, localhost,
              or the evidence-model storyboard approach (Activity 5, Pathway B) — no real
              credentials, anywhere, ever.
            </p>
          </div>
        </section>

        {/* ============================= ACTIVITY 1 ============================= */}
        <section className="space-y-6">
          <ActivityHeading number="1" title="Observe and model a client-server exchange" marks={15} />
          <p className="text-sm text-secondary">
            The brief: pick one familiar university service (LMS, library catalogue, student
            portal, or a public website), observe one normal user action, then produce an original
            request-response diagram, an eight-step interaction sequence, and a 120-150 word
            explanation of why client and server roles are asymmetric.
          </p>

          <ExplainerBox title="The core idea: request-response, and who's allowed to speak first">
            <p>
              Every client-server interaction follows the same basic shape. The{" "}
              <strong className="text-heading">client</strong> is the program that wants something —
              a browser, an app, a command-line tool — and it always speaks first by sending a{" "}
              <strong className="text-heading">request</strong>. The{" "}
              <strong className="text-heading">server</strong> is the program that owns a resource
              or a service, and it can only ever <em>respond</em> — it never initiates contact with
              a client out of nowhere. That one-directional &ldquo;who goes first&rdquo; rule is the
              entire client-server model in one sentence.
            </p>
          </ExplainerBox>

          <div className="rounded-2xl border border-card-border bg-muted p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
              <div className="rounded-xl border-2 border-accent bg-card px-5 py-4 text-center">
                <p className="font-semibold text-heading">Client</p>
                <p className="text-xs text-secondary mt-1">Active — initiates, short-lived</p>
              </div>
              <div className="flex flex-col items-center gap-1 text-xs font-mono text-secondary">
                <span>request →</span>
                <span>← response</span>
              </div>
              <div className="rounded-xl border-2 border-accent-warm bg-card px-5 py-4 text-center">
                <p className="font-semibold text-heading">Server</p>
                <p className="text-xs text-secondary mt-1">Passive — waits, long-running</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-card-border bg-card p-5 space-y-3">
            <h3 className="text-base font-semibold text-heading">
              The eight-step sequence, worked through generically
            </h3>
            <p className="text-sm text-body">
              Any client-server exchange — an LMS page load, a library search, a portal login — can
              be reconstructed as this same eight-step skeleton. Map your own chosen service onto
              these eight steps rather than starting from a blank page:
            </p>
            <ol className="text-sm text-body space-y-1.5 list-decimal list-inside">
              <li>The server process starts up and begins listening for connections on a known address/port.</li>
              <li>The client process starts (e.g. you open the app or navigate to the site).</li>
              <li>The client sends a request to the server (e.g. &ldquo;GET this page&rdquo; or &ldquo;log me in&rdquo;).</li>
              <li>The server receives the request and parses what&rsquo;s being asked for.</li>
              <li>The server does the actual work — looks up a record, reads a file, checks a database.</li>
              <li>The server sends a response back to the client (the requested data, or an error).</li>
              <li>The client receives the response and does something with it (renders the page, shows the result).</li>
              <li>The server loops back to waiting for the next request — from this client or any other.</li>
            </ol>
          </div>

          <div>
            <h3 className="text-base font-semibold text-heading mb-2">
              Client-server vs the alternative — why this matters for the asymmetry answer
            </h3>
            <ComparisonTable data={findTable("client-server-vs-p2p")} />
          </div>

          <div className="rounded-2xl border border-card-border bg-card p-5 space-y-2">
            <h3 className="text-base font-semibold text-heading">
              A model answer for the 120-150 word asymmetry explanation
            </h3>
            <p className="text-xs text-secondary">
              This is a generic, worked example of the reasoning and structure the assignment
              wants — not a description of any one specific service. Rewrite it in your own words,
              anchored to the actual service your group observed, for your submission.
            </p>
            <p className="text-sm text-body italic border-l-2 border-accent pl-4">
              Client and server roles are asymmetric because they are not interchangeable, and each
              side plays a fundamentally different part in the exchange. The server is passive: it
              starts first, binds to a known address, and then waits indefinitely for requests,
              ready to serve any number of clients over its lifetime. The client is active: it
              decides when to start, initiates every request, and typically exists only briefly,
              often for the length of a single transaction. The server never contacts a client
              first; it can only respond to a request it already received. This means the two sides
              need completely different internal logic: the server&rsquo;s code is built around an
              endless waiting-and-responding loop, while the client&rsquo;s code is built around
              initiating one request, receiving one response, then finishing. That structural
              difference, not just terminology, is what makes the relationship asymmetric rather
              than a simple two-way peer connection.
            </p>
            <p className="text-xs text-secondary">(146 words.)</p>
          </div>

          <DoItYourself>
            <p>
              <strong className="text-heading">1. Pick your service and the one action</strong> —
              e.g. &ldquo;a student opens the library catalogue and searches for a book title.&rdquo;
              Write down, in plain language: the client process (browser tab), the server service
              (the library catalogue server), the request (a search query), the response (a results
              list), the likely application protocol (HTTP/HTTPS), the transport protocol (TCP),
              and the network path in plain words (device → campus/home network → Internet → the
              service&rsquo;s server).
            </p>
            <p>
              <strong className="text-heading">2. Draw your own diagram</strong> — two labelled
              boxes (client, server), arrows for request and response, and a caption. Use the
              generic diagram above only as a layout reference for what &ldquo;labelled and
              arrowed&rdquo; means — redraw it with your own service&rsquo;s specific labels by
              hand or in any drawing tool your group actually used together.
            </p>
            <p>
              <strong className="text-heading">3. Adapt the eight-step sequence</strong> above to
              your specific service and action — replace the generic verbs with what actually
              happens for your chosen service at each of the eight steps.
            </p>
            <p>
              <strong className="text-heading">4. Rewrite the asymmetry paragraph</strong> in your
              own words, referencing your specific service, staying within 120-150 words.
            </p>
          </DoItYourself>
        </section>

        {/* ============================= ACTIVITY 2 ============================= */}
        <section className="space-y-6">
          <ActivityHeading number="2" title="Test the effect of the server model" marks={15} />
          <p className="text-sm text-secondary">
            The brief: four requests (A=4s, B=12s, C=3s, D=8s) arrive at the same instant. Model
            them under an iterative server and a concurrent server, calculate the average
            completion time under both, and recommend a model for the Department&rsquo;s learning
            service.
          </p>

          <div className="rounded-xl bg-accent-warm-bg p-4">
            <p className="text-sm font-semibold text-heading mb-1">CONCEPT CHECK from the brief</p>
            <p className="text-sm text-body">
              An <strong>iterative server model</strong> (this activity) and{" "}
              <strong>iterative DNS resolution</strong> (Activity 4C) are two completely unrelated
              ideas that just happen to share the word &ldquo;iterative.&rdquo; A server model
              describes how a server handles multiple client <em>requests</em> — one at a time, or
              in parallel. Iterative DNS resolution describes how a resolver walks through multiple
              DNS <em>servers</em> — root, then TLD, then authoritative — asking each one in turn.
              Nothing about server request-handling is involved in DNS resolution at all. State this
              distinction explicitly in your report, as the brief asks.
            </p>
          </div>

          <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6">
            <h3 className="text-base font-semibold text-heading mb-1">
              Live simulator — edit the durations, compare both models
            </h3>
            <p className="text-body text-sm mb-4">
              Loaded with the assignment&rsquo;s exact table (A=4s, B=12s, C=3s, D=8s). Change any
              duration and both timelines recompute instantly — this is the calculation the
              activity is asking you to perform and record.
            </p>
            <ServerModelSimulator />
          </div>

          <div className="rounded-2xl border border-card-border bg-card p-5 space-y-3">
            <h3 className="text-base font-semibold text-heading">Worked recommendation for the Department</h3>
            <p className="text-sm text-body">
              <strong className="text-heading">Recommendation: a concurrent server.</strong> Defend
              it on all four dimensions the brief asks for:
            </p>
            <ul className="text-sm text-body space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-heading">Workload:</strong> the four request types (DNS
                answer, file listing, web page, upload validation) are unrelated and independent —
                nothing about answering a DNS query depends on finishing a file listing first, so
                there&rsquo;s no reason to force them into a single queue.
              </li>
              <li>
                <strong className="text-heading">Waiting time:</strong> the simulator shows a real
                average-completion-time gap (16.5s iterative vs 6.75s concurrent, on the default
                table) driven entirely by one long job (B, 12s) blocking three shorter, unrelated
                jobs behind it — exactly the &ldquo;head-of-line blocking&rdquo; problem a learning
                service with mixed request types would hit constantly.
              </li>
              <li>
                <strong className="text-heading">Implementation complexity:</strong> concurrency
                isn&rsquo;t free — it needs a worker per request (thread/process) and careful
                handling if two requests ever touch shared state (e.g. two uploads writing to the
                same file). For this workload, that cost is manageable and standard practice; it
                would only be a real concern for a single-purpose, extremely low-traffic tool.
              </li>
              <li>
                <strong className="text-heading">Fairness:</strong> under the iterative model, a
                client asking a trivially small question (the 3-second web page, C) can still be
                stuck waiting behind someone else&rsquo;s large job (B) purely due to arrival order —
                an unfair outcome that has nothing to do with how much work their own request
                actually needs. Concurrency removes that dependency entirely.
              </li>
            </ul>
          </div>
        </section>

        {/* ============================= ACTIVITY 3 ============================= */}
        <section className="space-y-6">
          <ActivityHeading number="3" title="Reconstruct the Berkeley socket conversation" marks={20} />
          <p className="text-sm text-secondary">
            The brief: arrange the server-side operations (socket, bind, listen, accept, recv,
            send, close) and client-side operations (socket, connect, send, recv, close) into a
            correctly ordered, connected two-lane storyboard, identify the listening vs accepted
            socket, build a realistic 5-tuple, and write 6-10 lines of pseudocode.
          </p>

          <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6">
            <h3 className="text-base font-semibold text-heading mb-1">
              Interactive storyboard — the correctly interleaved call sequence
            </h3>
            <p className="text-body text-sm mb-4">
              Step through it (or hit Play). Watch for the moment accept() returns — that&rsquo;s
              the exact instant the accepted socket is born.
            </p>
            <SocketSequenceStoryboard />
          </div>

          <div className="rounded-2xl border border-card-border bg-card p-5 space-y-3">
            <h3 className="text-base font-semibold text-heading">
              One plain-language sentence per function
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Call</th>
                    <th className="text-left p-2 text-heading font-semibold border-b border-card-border">What it accomplishes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["socket()", "Creates a new socket — a communication endpoint, not yet attached to any address."],
                    ["bind() (server)", "Attaches the socket to a specific local IP address and port so the OS routes matching traffic to it."],
                    ["listen() (server)", "Marks the socket as passive and sets how many pending connections may queue before being accepted."],
                    ["accept() (server)", "Blocks until a client connects, then returns a brand-new socket dedicated to that one client."],
                    ["connect() (client)", "Actively initiates a connection to the server's address, triggering the TCP three-way handshake."],
                    ["send()", "Writes outgoing data onto an already-connected socket."],
                    ["recv()", "Reads incoming data that has arrived on a connected socket."],
                    ["close()", "Releases a socket and, for TCP, begins the connection-termination sequence."],
                  ].map(([call, desc]) => (
                    <tr key={call} className="border-b border-card-border last:border-0">
                      <td className="p-2 font-mono text-heading whitespace-nowrap align-top">{call}</td>
                      <td className="p-2 text-body align-top">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-card-border bg-card p-5 space-y-3">
            <h3 className="text-base font-semibold text-heading">A realistic 5-tuple, worked and explained</h3>
            <p className="text-sm text-body">
              Using hypothetical private addresses, as the brief requires:
            </p>
            <div className="rounded-xl bg-muted p-4 font-mono text-sm text-heading grid gap-1 sm:grid-cols-5">
              <span>Protocol: TCP</span>
              <span>Src IP: 192.168.10.25</span>
              <span>Src port: 51473</span>
              <span>Dst IP: 192.168.10.5</span>
              <span>Dst port: 8080</span>
            </div>
            <p className="text-sm text-body">
              This is the client&rsquo;s side of the accepted socket connection: the client
              (192.168.10.25) picked an ephemeral high port (51473 — the OS assigns one
              automatically) to talk to the server (192.168.10.5) on the port it&rsquo;s listening
              on (8080).
            </p>
            <p className="text-sm text-body">
              <strong className="text-heading">Why the full 5-tuple, and not just the destination IP/port, is needed:</strong>{" "}
              a server&rsquo;s listening socket can have many simultaneous accepted-socket
              connections that all share the exact same destination IP and port — every one of
              those clients is talking to 192.168.10.5:8080. What makes each connection unique is
              the <em>combination</em> of all five values together: two different clients
              necessarily have different source IPs and/or source ports, so the OS uses the whole
              5-tuple to demultiplex incoming packets to the correct accepted socket, even though
              the destination side of the tuple is identical for all of them.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-card-border bg-card p-5">
              <h4 className="text-sm font-semibold text-heading mb-2">Server pseudocode (8 lines)</h4>
              <pre className="text-xs font-mono text-body bg-muted rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
{`sock = create_socket(TCP)
bind(sock, "192.168.10.5", 8080)
listen(sock, backlog=5)
loop forever:
    client_sock = accept(sock)
    data = recv(client_sock, 1024)
    response = handle_request(data)
    send(client_sock, response)
    close(client_sock)`}
              </pre>
            </div>
            <div className="rounded-2xl border border-card-border bg-card p-5">
              <h4 className="text-sm font-semibold text-heading mb-2">Client pseudocode (6 lines)</h4>
              <pre className="text-xs font-mono text-body bg-muted rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
{`sock = create_socket(TCP)
connect(sock, "192.168.10.5", 8080)
send(sock, "GET /status")
response = recv(sock, 4096)
print(response)
close(sock)`}
              </pre>
            </div>
          </div>

          <DoItYourself>
            <p>
              The brief asks for a <strong className="text-heading">group-created</strong> storyboard
              or flow diagram. Use the interactive version above (and the sentence-per-function
              table) as your reference for the correct order, the arrows, and the
              listening-vs-accepted-socket labelling — then build your own visual version together
              (poster paper, slides, or a drawing tool), and pick either the server or client
              pseudocode above to adapt into your own submission (programming syntax isn&rsquo;t
              assessed, so keep the same logical order and make it your own).
            </p>
          </DoItYourself>
        </section>

        {/* ============================= ACTIVITY 4 ============================= */}
        <section className="space-y-6">
          <ActivityHeading number="4" title="Investigate and diagnose DNS" marks={25} />
          <p className="text-sm text-secondary">
            The biggest activity, in five parts: build the hierarchy (4A), gather real command-line
            evidence (4B), explain the resolution path (4C), reason about caching/TTL (4D), and
            diagnose the actual incident described in the scenario (4E).
          </p>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-heading">4A. The hierarchy of cs.knust.edu.gh</h3>
            <div className="rounded-2xl border border-card-border bg-card p-5">
              <div className="space-y-2 font-mono text-sm">
                <div className="rounded-lg bg-muted px-3 py-2">
                  <span className="text-heading font-semibold">.</span>{" "}
                  <span className="text-secondary">— the root zone (the top of the entire DNS tree)</span>
                </div>
                <div className="ml-6 rounded-lg bg-muted px-3 py-2 border-l-2 border-accent">
                  <span className="text-heading font-semibold">gh</span>{" "}
                  <span className="text-secondary">— top-level domain (TLD), specifically Ghana&rsquo;s country-code TLD (ccTLD)</span>
                </div>
                <div className="ml-12 rounded-lg bg-muted px-3 py-2 border-l-2 border-accent">
                  <span className="text-heading font-semibold">edu.gh</span>{" "}
                  <span className="text-secondary">— second-level domain, delegated for Ghanaian educational institutions</span>
                </div>
                <div className="ml-[4.5rem] rounded-lg bg-muted px-3 py-2 border-l-2 border-accent">
                  <span className="text-heading font-semibold">knust.edu.gh</span>{" "}
                  <span className="text-secondary">— third-level / organizational domain, delegated to KNUST specifically</span>
                </div>
                <div className="ml-24 rounded-lg bg-muted px-3 py-2 border-l-2 border-accent">
                  <span className="text-heading font-semibold">cs.knust.edu.gh</span>{" "}
                  <span className="text-secondary">— subdomain, delegated to the Computer Science department</span>
                </div>
                <div className="ml-[7.5rem] rounded-lg bg-accent/10 px-3 py-2 border-l-2 border-accent">
                  <span className="text-accent font-semibold">learn.cs.knust.edu.gh</span>{" "}
                  <span className="text-secondary">— host / fully qualified domain name (FQDN) — the specific learning server</span>
                </div>
              </div>
            </div>
            <ExplainerBox title="Why is DNS distributed instead of one giant worldwide server?">
              <p>
                Three reasons, and all three matter for this exact scenario. <strong className="text-heading">Scale</strong>:
                no single machine could store or serve every hostname mapping on Earth with
                acceptable latency. <strong className="text-heading">Delegation of control</strong>:
                KNUST&rsquo;s IT team needs to be able to add/change learn.cs.knust.edu.gh without
                filing a request to some global authority — the .gh registry delegates edu.gh, which
                delegates knust.edu.gh, which KNUST&rsquo;s own DNS admins fully control. <strong className="text-heading">Fault
                isolation and caching</strong>: if one zone&rsquo;s authoritative server is down,
                only lookups for that specific zone are affected, and every level along the way gets
                cached, so most real-world lookups never even reach the root.
              </p>
            </ExplainerBox>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-heading">4B. Gather observable evidence</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Purpose</th>
                    <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Command</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Resolve a name", "nslookup example.com"],
                    ["Inspect mail records", "nslookup -type=MX knust.edu.gh"],
                    ["Inspect name servers", "nslookup -type=NS knust.edu.gh"],
                  ].map(([purpose, cmd]) => (
                    <tr key={cmd} className="border-b border-card-border last:border-0">
                      <td className="p-2 text-body align-top">{purpose}</td>
                      <td className="p-2 font-mono text-heading align-top">{cmd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-2xl border border-card-border bg-card p-5 space-y-2">
              <p className="text-sm font-semibold text-heading">
                A generic, illustrative example of what to look for (not your evidence — see the box below)
              </p>
              <pre className="text-xs font-mono text-body bg-muted rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
{`> nslookup example.com
Server:   192.168.1.1          <- which resolver answered you (usually your router/ISP)
Address:  192.168.1.1#53

Non-authoritative answer:      <- came from a cache, not the authoritative source directly
Name:     example.com
Address:  93.184.216.34        <- the actual A record: the IP you were looking for`}
              </pre>
              <ul className="text-sm text-body space-y-1 list-disc list-inside">
                <li><span className="font-mono">Server:</span> tells you which resolver actually answered — not the authoritative server, almost always your local/ISP resolver.</li>
                <li><span className="font-mono">Non-authoritative answer:</span> a label meaning this answer came from that resolver&rsquo;s cache, not fetched fresh from the authoritative source in this instant.</li>
                <li>For <span className="font-mono">-type=MX</span>: look for a preference number (lower = tried first) and a mail-exchanger hostname.</li>
                <li>For <span className="font-mono">-type=NS</span>: look for the list of hostnames that are authoritative for that zone.</li>
              </ul>
            </div>
            <DoItYourself>
              <p>
                Open a terminal (Command Prompt/PowerShell on Windows, Terminal on macOS/Linux) and
                run the three commands from the table above yourself — substitute a real, safe
                target you have permission to query (example.com is always safe; try
                knust.edu.gh for the MX/NS queries as the brief suggests). Screenshot each result.
                Under each screenshot, write: (1) the exact question you asked, (2) which
                resolver/server answered (from the <span className="font-mono">Server:</span> line),
                (3) the record type returned, and (4) what it means in your own words. If
                command-line access isn&rsquo;t available, use Cisco Packet Tracer&rsquo;s DNS
                tools or your instructor&rsquo;s demonstration instead, and say so explicitly. Your
                results will differ from every other group&rsquo;s and from the example above —
                that&rsquo;s expected and fine; interpretation is what&rsquo;s graded.
              </p>
            </DoItYourself>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-heading">4C. The resolution path — recursive vs iterative</h3>
            <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6">
              <h4 className="text-base font-semibold text-heading mb-1">
                Watch the exact chain this activity is asking you to diagram
              </h4>
              <p className="text-body text-sm mb-4">
                This is the same underlying mechanism as looking up learn.cs.knust.edu.gh — the
                domain name changes, the chain of who-asks-whom doesn&rsquo;t.
              </p>
              <DNSSimulator />
            </div>
            <div className="rounded-2xl border border-card-border bg-card p-5 space-y-2">
              <p className="text-sm text-body">
                <strong className="text-heading">Recursive vs iterative, precisely:</strong> the{" "}
                <strong className="text-heading">stub resolver</strong> on the student&rsquo;s device
                makes exactly one <strong className="text-heading">recursive</strong> request — it
                asks the local recursive resolver once and expects a complete final answer, doing
                none of the legwork itself. The <strong className="text-heading">recursive resolver</strong>{" "}
                then does the work: it sends a series of <strong className="text-heading">iterative</strong>{" "}
                queries — to the root, then the TLD server, then the authoritative server — where
                each server either gives the final answer or a referral to the next server to try,
                and the resolver itself decides where to go next each time.
              </p>
              <p className="text-sm text-body">
                In a sequence diagram, label the student-device-to-resolver arrows{" "}
                <span className="font-mono">recursive query</span> and the
                resolver-to-{"{root, TLD, authoritative}"} arrows{" "}
                <span className="font-mono">iterative query / referral</span>. The A (or AAAA)
                record is returned at the very last step, when the authoritative server answers the
                resolver directly. The client only contacts the actual application server (the
                learning service itself) after that IP address has been returned all the way back
                to it — DNS resolution and the application connection are two completely separate
                steps.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-heading">4D. Caching and TTL, worked through</h3>
            <div className="rounded-2xl border border-card-border bg-card p-5 space-y-2">
              <p className="text-sm text-body">
                <strong className="text-heading">Given:</strong> first lookup = 820 ms, second lookup
                shortly after = 22 ms, TTL = 300 seconds.
              </p>
              <p className="text-sm text-body">
                <strong className="text-heading">Why the second lookup is ~37× faster:</strong> the
                first lookup had to walk the full chain — resolver → root → TLD → authoritative —
                which costs several round trips across the network. The moment that answer came
                back, the resolver stored it locally along with its TTL. The second lookup, made
                shortly after, is answered straight from that local cache — no network walk at all,
                just a fast local memory read, which is why 22 ms is roughly the cost of one quick
                round trip to the resolver rather than four-plus round trips across the wider
                Internet.
              </p>
              <p className="text-sm text-body">
                <strong className="text-heading">What happens after the 300-second TTL expires:</strong>{" "}
                the resolver discards the cached entry and treats the next request for that name as
                if it were the very first lookup again — it repeats the full root → TLD →
                authoritative walk and pays the higher latency (roughly 820 ms again) once, then
                caches the fresh answer for another 300 seconds.
              </p>
              <p className="text-sm text-body">
                <strong className="text-heading">One performance benefit:</strong> caching massively
                reduces both latency for users (22 ms vs 820 ms) and load on the root/TLD/
                authoritative servers, which would be overwhelmed if every single lookup, from every
                device on Earth, had to walk the full chain every time.
              </p>
              <p className="text-sm text-body">
                <strong className="text-heading">One risk:</strong> if the record changes (e.g. the
                learning server moves to a new IP), every resolver that already cached the old
                answer keeps serving the stale IP until its TTL expires — this is exactly why DNS
                changes are described as taking time to &ldquo;propagate,&rdquo; and it&rsquo;s a
                direct, real consequence of the same caching behaviour that makes DNS fast.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-heading">4E. Diagnose the incident — a full worked case study</h3>
            <div className="rounded-2xl border border-card-border bg-card p-5 space-y-3">
              <p className="text-sm text-body">
                <strong className="text-heading">Scenario:</strong> students can reach the learning
                server by IP address, but get an error using
                learn.cs.knust.edu.gh.
              </p>
              <p className="text-sm text-body">
                <strong className="text-heading">Most likely subsystem at fault: name resolution
                (DNS)</strong> — not routing, not the application server itself, and not the
                physical network path. The fact that the IP address works proves the server is up,
                the network route to it is fine, and the application (whatever service listens on
                that IP) is responding correctly. The <em>only</em> thing that changes between
                &ldquo;works by IP&rdquo; and &ldquo;fails by name&rdquo; is the translation step
                from name to IP — so that step is where the fault must be.
              </p>
              <p className="text-sm text-body">
                <strong className="text-heading">Two plausible causes:</strong>
              </p>
              <ol className="text-sm text-body space-y-1.5 list-decimal list-inside">
                <li>
                  The A (or AAAA) record for learn.cs.knust.edu.gh was never created, or was
                  created incorrectly, in the authoritative zone for cs.knust.edu.gh — a genuine
                  configuration gap at the source.
                </li>
                <li>
                  The record exists and is correct at the authoritative server, but hasn&rsquo;t
                  finished propagating — some students&rsquo; resolvers cached a &ldquo;doesn&rsquo;t
                  exist&rdquo; (or plain wrong) answer from before the record was added, and
                  won&rsquo;t re-query until their local TTL expires.
                </li>
              </ol>
              <p className="text-sm text-body">
                <strong className="text-heading">Three ordered diagnostic checks:</strong>
              </p>
              <ol className="text-sm text-body space-y-2 list-decimal list-inside">
                <li>
                  <span className="font-mono">nslookup learn.cs.knust.edu.gh</span> using the
                  default resolver. <em>If it returns &ldquo;can&rsquo;t find&rdquo;/NXDOMAIN</em>,
                  that immediately narrows things toward cause 1 (the record genuinely doesn&rsquo;t
                  resolve anywhere yet). <em>If it does return an answer</em> (even a wrong one),
                  that points toward cause 2 (a caching/propagation issue somewhere downstream)
                  rather than a missing record.
                </li>
                <li>
                  Find the authoritative name servers with{" "}
                  <span className="font-mono">nslookup -type=NS cs.knust.edu.gh</span>, then query
                  one of them directly:{" "}
                  <span className="font-mono">nslookup learn.cs.knust.edu.gh &lt;authoritative-server&gt;</span>.
                  Querying the authoritative source directly bypasses every cache in between. If it
                  fails <em>here too</em>, that confirms cause 1 — the record truly is missing or
                  misconfigured at the source, and the fix is for KNUST&rsquo;s DNS admins to add or
                  correct the record. If it <em>succeeds</em> here, the record is fine at the
                  source, which points squarely at cause 2.
                </li>
                <li>
                  If cause 2 looks likely, check resolution from a different network or device (or
                  an online DNS-propagation checker) to see whether the record is visible from
                  outside the affected students&rsquo; own machines. If it resolves correctly
                  elsewhere but not on the affected devices, that confirms a stale local cache —
                  the practical fix is simply waiting out the remaining TTL, or manually clearing
                  the local cache (e.g. <span className="font-mono">ipconfig /flushdns</span> on
                  Windows) on the affected machines.
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* ============================= ACTIVITY 5 ============================= */}
        <section className="space-y-6">
          <ActivityHeading number="5" title="Make a safe Telnet/FTP decision" marks={15} />
          <p className="text-sm text-secondary">
            The brief: compare Telnet vs SSH for administration and FTP/FTPS/SFTP for file
            transfer, recommend one of each with justification, and demonstrate the flow safely —
            no real credentials, ever.
          </p>

          <ComparisonTable data={findTable("telnet-vs-ssh")} />
          <ComparisonTable data={findTable("ftp-vs-sftp")} />

          <div className="rounded-2xl border border-card-border bg-card p-5 space-y-2">
            <h3 className="text-base font-semibold text-heading">Where FTPS fits in</h3>
            <p className="text-sm text-body">
              FTPS is classic FTP wrapped in TLS/SSL — it does encrypt credentials and data, unlike
              plain FTP, which is the main point in its favour. But it keeps FTP&rsquo;s original
              two-channel design (a separate control connection and data connection), which is
              awkward through firewalls and NAT and adds operational complexity that SFTP, built as
              a single encrypted channel from the start, simply avoids. FTPS is a legitimate
              improvement over plain FTP, but SFTP is the cleaner, more commonly recommended choice
              where either is an option — as it is here.
            </p>
          </div>

          <div className="rounded-2xl border border-card-border bg-card p-5 space-y-2">
            <h3 className="text-base font-semibold text-heading">
              Recommendation for the Department, justified
            </h3>
            <p className="text-sm text-body">
              <strong className="text-heading">Remote administration: SSH, not Telnet.</strong> The
              technician&rsquo;s Telnet proposal sends every administrator&rsquo;s username and
              password in plain text over the network — anyone on the same network segment (a
              shared campus Wi-Fi, a compromised switch) can capture full admin credentials with a
              basic packet capture tool. SSH provides the identical remote command-line
              functionality while encrypting the entire session, at effectively no extra cost, since
              SSH is standard on every modern operating system.
            </p>
            <p className="text-sm text-body">
              <strong className="text-heading">File transfer: SFTP, not FTP.</strong> Uploading
              course files (as described in the scenario) means transferring both credentials and
              file contents — FTP exposes both in plain text, and its unreliability (mentioned in
              the challenge brief itself: &ldquo;file uploads are unreliable&rdquo;) is also
              partly explained by its awkward two-channel design, which is prone to breaking through
              firewalls/NAT. SFTP solves both problems at once: encrypted credentials and data, over
              a single, firewall-friendly connection, running on infrastructure the Department would
              already have if it adopts SSH for administration.
            </p>
          </div>

          <div className="rounded-2xl border border-card-border bg-card p-5 space-y-3">
            <h3 className="text-base font-semibold text-heading">
              Pathway B model: an annotated evidence storyboard
            </h3>
            <p className="text-sm text-body">
              A worked example of the storyboard structure the brief asks for — connection,
              authentication, command, response, data, closure — with the parts that must be
              encrypted marked. Adapt this structure with your own scenario details for your
              submission.
            </p>
            <div className="rounded-xl border border-card-border overflow-hidden">
              {[
                { step: "1. Connection", detail: "Client opens a TCP connection to the server on the service's port.", secure: false },
                { step: "2. Authentication", detail: "Client sends username and password (SSH/SFTP: exchanged inside an already-encrypted channel).", secure: true },
                { step: "3. Command", detail: "Client sends an instruction, e.g. \"upload lecture-notes.pdf\" or a shell command.", secure: true },
                { step: "4. Response", detail: "Server acknowledges the command or reports an error.", secure: true },
                { step: "5. Data", detail: "The actual file contents or terminal output are transferred.", secure: true },
                { step: "6. Closure", detail: "Either side closes the connection cleanly.", secure: false },
              ].map((row, i, arr) => (
                <div
                  key={row.step}
                  className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm bg-card text-body ${
                    i !== arr.length - 1 ? "border-b border-card-border" : ""
                  }`}
                >
                  <span>
                    <span className="font-semibold text-heading">{row.step}</span> — {row.detail}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      row.secure ? "bg-error-bg text-error" : "bg-muted text-secondary"
                    }`}
                  >
                    {row.secure ? "must be encrypted" : "no sensitive data"}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-secondary">
              Steps 2-5 carry credentials and/or real data, which is exactly why Telnet and plain
              FTP — which send every one of those steps in clear text — are unsafe for anything but
              an isolated lab, and why SSH/SFTP&rsquo;s whole-session encryption matters.
            </p>
          </div>

          <DoItYourself>
            <p>
              <strong className="text-heading">If your group has Cisco Packet Tracer access (Pathway A):</strong>{" "}
              build a small topology (a PC, a switch, a server running DNS + FTP/Telnet services),
              configure it, and capture labelled screenshots of a client contacting DNS and then
              the FTP/Telnet service — explain the request-response flow under each screenshot.
            </p>
            <p>
              <strong className="text-heading">Otherwise (Pathway B):</strong> redraw the storyboard
              above as your own diagram, with your own labels/styling, and write one or two
              sentences per step explaining what an attacker could see if that step were sent
              unencrypted (Telnet/FTP) versus what they&rsquo;d see with SSH/SFTP (just opaque
              encrypted bytes). No real credentials anywhere in your diagram or explanation.
            </p>
          </DoItYourself>
        </section>

        {/* ============================= ACTIVITY 6 ============================= */}
        <section className="space-y-6">
          <ActivityHeading number="6" title="Present the recovery plan and reflect" marks={10} />
          <p className="text-sm text-secondary">
            A five-minute group briefing where every member explains at least one piece of
            evidence, ending with an ordered recovery plan, plus a 200-250 word individual
            reflection from each member.
          </p>

          <div className="rounded-2xl border border-card-border bg-card p-5 space-y-3">
            <h3 className="text-base font-semibold text-heading">A suggested ordered recovery plan structure</h3>
            <p className="text-sm text-body">
              Pull directly from the diagnosis you built in Activity 4E and the recommendations
              from Activity 5 — the pieces are already there, this just sequences them for the
              Department to act on:
            </p>
            <ol className="text-sm text-body space-y-1.5 list-decimal list-inside">
              <li>Run the three ordered diagnostic checks from Activity 4E to confirm whether the fault is a missing/misconfigured DNS record or a caching/propagation delay.</li>
              <li>If it&rsquo;s a missing/misconfigured record: correct the A/AAAA record for learn.cs.knust.edu.gh at the authoritative source.</li>
              <li>If it&rsquo;s propagation: communicate the expected wait (bounded by the TTL) and, where possible, have affected users flush their local DNS cache.</li>
              <li>Replace the technician&rsquo;s Telnet proposal with SSH for remote administration, and adopt SFTP (instead of the unreliable FTP currently in use) for course-file uploads — both changes reuse the same underlying SSH infrastructure.</li>
              <li>Re-test: confirm the service resolves by name from multiple networks, and confirm an SSH/SFTP session authenticates and transfers a file correctly end to end.</li>
            </ol>
          </div>

          <div className="rounded-2xl border border-card-border bg-card p-5 space-y-2">
            <h3 className="text-base font-semibold text-heading">Structuring the five-minute briefing</h3>
            <p className="text-sm text-body">
              Assign roughly 45-60 seconds per member (for a 4-5 person group), each covering one
              piece of evidence they personally gathered or built — e.g. the socket storyboard, the
              server-model timing comparison, the DNS command captures, the protocol
              recommendation — ending with 30-45 seconds where the group states the recovery plan
              above together. Since the rubric specifically checks that you can &ldquo;explain every
              diagram and screenshot without reading from the report,&rdquo; practice explaining
              your one piece out loud, from memory, at least once before presenting.
            </p>
          </div>

          <DoItYourself>
            <p>
              <strong className="text-heading">Individual reflection (200-250 words, written by you, not the group):</strong>{" "}
              answer, honestly and specifically:
            </p>
            <ul className="text-sm text-body space-y-1 list-disc list-inside">
              <li>What did I initially misunderstand about client-server communication, sockets, or DNS?</li>
              <li>Which specific activity (name it) changed my understanding, and how?</li>
              <li>How would I explain DNS and sockets to a new first-year student, in my own words?</li>
              <li>What did I specifically contribute to the group&rsquo;s work?</li>
            </ul>
            <p>
              A useful way to find real material for this: think back to the moment on this page
              (or in the group discussion) where something clicked — that specific &ldquo;oh, that&rsquo;s
              why&rdquo; moment is exactly what this reflection is asking for, and it&rsquo;s
              different for every student, which is the point.
            </p>
          </DoItYourself>
        </section>

        {/* ============================= PORTFOLIO ============================= */}
        <section id="portfolio" className="scroll-mt-24 space-y-4">
          <h2 className="text-xl font-semibold text-heading">Required submission — portfolio checklist</h2>
          <p className="text-sm text-body">
            One group portfolio (single PDF or DOCX, normally 8-12 pages excluding appendices),
            plus one individual reflection per member. Here&rsquo;s every section mapped to what
            this page gave you versus what only your group can produce:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 text-heading font-semibold border-b border-card-border">#</th>
                  <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Section</th>
                  <th className="text-left p-2 text-heading font-semibold border-b border-card-border">This page gives you</th>
                  <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Only you can produce</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["1", "Cover & team record", "—", "Names, student numbers, roles, signed contribution statement."],
                  ["2", "Client-server model", "The 8-step template, asymmetry model paragraph, comparison table", "Your original diagram of your chosen service; your rewritten sequence and paragraph."],
                  ["3", "Server-model evidence", "Full timing calculator, verified averages, recommendation reasoning", "Recording your own simulator run (or acting it out) and writing it up."],
                  ["4", "Socket storyboard", "Correct call sequence, per-function table, 5-tuple, pseudocode", "Your own drawn storyboard adapting this structure."],
                  ["5", "DNS investigation", "Hierarchy, resolution mechanics, caching/TTL reasoning, full incident diagnosis", "Your own command captures (4B) and their interpretation."],
                  ["6", "Protocol decision", "Both comparison tables, recommendation reasoning, evidence-model template", "Your own Pathway A/B demonstration and screenshots."],
                  ["7", "Reflection & sources", "Reflection prompts, recovery-plan structure", "Each member's individual 200-250 word reflection; your source list."],
                ].map(([n, title, given, yours]) => (
                  <tr key={n} className="border-b border-card-border last:border-0">
                    <td className="p-2 text-body align-top font-mono">{n}</td>
                    <td className="p-2 text-heading font-semibold align-top">{title}</td>
                    <td className="p-2 text-body align-top">{given}</td>
                    <td className="p-2 text-body align-top">{yours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-body">
            Remember the standards from the brief: every diagram must be group-created with labels,
            arrows, and a caption; every screenshot needs a written interpretation right below it;
            use only hypothetical/private IP addresses in examples; strip real usernames, device
            names, and public IPs from any screenshot; and cite the course slides plus any other
            sources you actually used, including how you used this page or any other AI assistance
            if your lecturer permits it — the group stays responsible for the technical accuracy of
            every statement submitted.
          </p>
        </section>

        {/* ============================= RUBRIC ============================= */}
        <section id="rubric" className="scroll-mt-24 space-y-4">
          <h2 className="text-xl font-semibold text-heading">The rubric, translated into plain advice</h2>
          <div className="space-y-3">
            {[
              {
                title: "Conceptual accuracy & integration (25 marks)",
                advice:
                  "Don't just define terms in isolation — explicitly connect them. E.g. explain how the socket 5-tuple relates to the server model handling multiple clients, and how DNS resolution precedes the client actually connecting to the socket described in Activity 3.",
              },
              {
                title: "Authentic investigation & evidence (20 marks)",
                advice:
                  "Every screenshot needs your own interpretation sentence right under it — a screenshot alone earns nothing. This is the criterion most directly about originality: use the DoItYourself boxes above as your checklist for what must be personally produced.",
              },
              {
                title: "DNS reasoning & diagnosis (20 marks)",
                advice:
                  "Make sure your report explicitly distinguishes recursive (client→resolver) from iterative (resolver→root/TLD/authoritative) queries, and that your incident diagnosis includes alternative explanations you considered and ruled out, not just one guess.",
              },
              {
                title: "Server model & socket workflow (15 marks)",
                advice:
                  "Show your actual numbers (start/completion/wait times for all four requests, both models) rather than just stating the two averages — the calculation itself is part of what's graded.",
              },
              {
                title: "Security & professional judgement (10 marks)",
                advice:
                  "Justify both recommendations (SSH, SFTP) by naming the specific risk each replaces (plain-text credentials, unreliable two-channel transfer) — a bare 'SSH is more secure' without the why is a weaker answer.",
              },
              {
                title: "Communication, teamwork & reflection (10 marks)",
                advice:
                  "Balanced participation is graded, not just output — make sure the person presenting each piece of evidence in the briefing is someone who can genuinely explain it, which is exactly why every DoItYourself box above is written for the whole group to work through together, not one person to do alone.",
              },
            ].map((r) => (
              <div key={r.title} className="rounded-xl bg-muted p-4">
                <p className="text-sm font-semibold text-heading mb-1">{r.title}</p>
                <p className="text-sm text-body">{r.advice}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================= SELF-CHECK ============================= */}
        <section id="self-check" className="scroll-mt-24 space-y-4">
          <h2 className="text-xl font-semibold text-heading">Final self-check before submission</h2>
          <div className="rounded-2xl border border-card-border bg-card p-5">
            <ul className="space-y-2">
              {[
                "We can explain every diagram and screenshot without reading from the report.",
                "We did not confuse an iterative server with iterative DNS resolution.",
                "Our socket calls are in a logically correct client/server order.",
                "Our DNS diagnosis uses evidence and includes alternative explanations.",
                "Our Telnet/FTP recommendations protect credentials and data.",
                "Every member contributed and submitted an individual reflection.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-body">
                  <span className="shrink-0 mt-0.5 h-4 w-4 rounded border border-card-border" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-secondary">
            Course materials referenced: Abdul-Salaam, G. (2026). <em>CSM 152 - Information
            Technology II: Client Server Concepts (DNS, Telnet, FTP)</em> [Lecture slides]; Brookshear,
            J. G., & Brylow, D. (2015). Chapter 4: Networking and the Internet, in <em>Computer
            Science: An Overview</em> (12th ed.).
          </p>
        </section>

        <div className="pt-4">
          <Link href="/networking" className="text-sm font-medium text-accent hover:underline">
            ◀ Back to IT — Networking
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
