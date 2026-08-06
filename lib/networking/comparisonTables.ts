import type { ComparisonTableData } from "@/lib/comparisonTables";

export const networkingComparisonTables: ComparisonTableData[] = [
  {
    id: "csmacd-vs-csmaca",
    title: "CSMA/CD vs CSMA/CA",
    columns: ["CSMA/CD (Ethernet)", "CSMA/CA (Wi-Fi)"],
    rows: [
      ["Full name: Collision Detection.", "Full name: Collision Avoidance."],
      ["Used on wired Ethernet.", "Used on wireless Wi-Fi."],
      ["Strategy: detect collisions after they occur.", "Strategy: prevent collisions before they occur."],
      ["A device can listen while transmitting.", "A device cannot reliably listen while transmitting."],
      ["Hidden terminal problem is not significant.", "Hidden terminal problem is a major issue — solved with RTS/CTS."],
      ["Mechanism: detect → stop → wait → retransmit.", "Mechanism: listen → wait → RTS/CTS handshake → transmit."],
    ],
  },
  {
    id: "tcp-vs-udp",
    title: "TCP vs UDP",
    columns: ["TCP", "UDP"],
    rows: [
      ["Connection-oriented.", "Connectionless."],
      ["Reliable: lost packets are resent, order is guaranteed.", "Unreliable: no resending, no guaranteed order."],
      ["Splits a message into packets and reassembles them.", "Never splits data into multiple packets."],
      ["More overhead — connection setup, acknowledgements.", "Simpler and faster — minimal overhead."],
      ["Good for: web pages, email, file transfer.", "Good for: DNS queries, streaming, gaming — speed over guarantees."],
    ],
  },
  {
    id: "circuit-vs-packet-switching",
    title: "Circuit switching vs Packet switching",
    columns: ["Circuit switching", "Packet switching"],
    rows: [
      ["A dedicated path is reserved for the whole connection.", "Data is chopped into packets sent independently; no dedicated path."],
      ["Three steps: establish, transfer, terminate the connection.", "Store-and-forward: each node receives, decides a route, forwards."],
      ["Wastes capacity during silence/pauses.", "Links are shared — better utilisation for bursty traffic."],
      ["Good fit: steady traffic like voice calls.", "Good fit: bursty, stop-start traffic like web/computer data."],
    ],
  },
  {
    id: "client-server-vs-p2p",
    title: "Client-server vs Peer-to-peer",
    columns: ["Client-server", "Peer-to-peer (P2P)"],
    rows: [
      ["One server, many clients.", "Processes communicate as equals."],
      ["The server must run continuously.", "Peer processes can be short-lived."],
      ["The client always initiates contact.", "Either side can initiate contact."],
    ],
  },
  {
    id: "ip-classes",
    title: "IPv4 address classes",
    columns: ["Class", "First octet range / default mask"],
    rows: [
      ["A", "0–127, default mask /8 (255.0.0.0) — designed for very large networks."],
      ["B", "128–191, default mask /16 (255.255.0.0) — designed for medium networks."],
      ["C", "192–223, default mask /24 (255.255.255.0) — designed for small networks."],
      ["D", "224–239 — reserved for multicast, no network/host split."],
      ["E", "240–255 — reserved for experimental use."],
    ],
  },
  {
    id: "telnet-vs-ssh",
    title: "Telnet vs SSH (remote administration)",
    columns: ["Telnet", "SSH (Secure Shell)"],
    rows: [
      ["Purpose: open a remote command-line session on another machine.", "Purpose: exactly the same — open a remote command-line session on another machine."],
      ["Sends everything — including the username and password — as plain, unencrypted text.", "Encrypts the entire session (login credentials, commands, and output) using public-key key exchange then a symmetric cipher."],
      ["Anyone who can observe the network traffic (e.g. on a shared Wi-Fi or a compromised switch) can read the password directly.", "An eavesdropper only sees encrypted bytes; the session is unreadable without the negotiated session key."],
      ["No way to verify you're actually talking to the real server — vulnerable to man-in-the-middle impersonation.", "The server proves its identity with a host key, and the client is warned if that key ever unexpectedly changes."],
      ["Historically simple and universally supported, but now considered unsafe for anything beyond an isolated lab/simulation.", "The modern, near-universal standard for remote administration — this is what \"the technician should have proposed.\""],
    ],
  },
  {
    id: "ftp-vs-sftp",
    title: "FTP vs SFTP (file transfer)",
    columns: ["FTP (File Transfer Protocol)", "SFTP (SSH File Transfer Protocol)"],
    rows: [
      ["Purpose: upload/download files between a client and a server.", "Purpose: exactly the same — upload/download files between a client and a server."],
      ["Sends the username, password, and the file contents themselves in plain text.", "Runs entirely inside an encrypted SSH connection — credentials and file contents are both protected."],
      ["Uses two separate connections: a control channel (commands) and a data channel (the actual file transfer) — awkward for firewalls/NAT.", "Uses a single connection (the normal SSH port), which is simpler to firewall and works cleanly through NAT."],
      ["A related variant, FTPS, wraps classic FTP in TLS/SSL encryption — better than plain FTP, but keeps FTP's separate-channel awkwardness and is less commonly deployed than SFTP.", "Despite the similar name, SFTP is not \"FTP over SSH\" — it's a different protocol design that was built for SSH from the start."],
      ["Appropriate use today: essentially none, for anything beyond an isolated lab/simulation with no real credentials.", "Appropriate use: the standard recommendation for transferring course files to/from a server like the Department's learning service."],
    ],
  },
];
