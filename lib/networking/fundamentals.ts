import type { BasicsGroup } from "@/lib/basics";

export const networkingFundamentalsGroups: BasicsGroup[] = [
  {
    id: "network-scope",
    title: "Network scope & topology",
    entries: [
      {
        id: "pan-lan-man-wan",
        title: "PAN, LAN, MAN, WAN",
        summary: "Networks are classified first by how far they physically reach.",
        eli5:
          "Think of it as distance circles around you. A PAN is your own personal bubble — your phone talking to your smartwatch, a few metres. A LAN is your house or office building. A MAN spans a whole town or city. A WAN stretches across countries — the Internet itself is the biggest WAN there is.",
        points: [
          "PAN (Personal Area Network): a handful of devices very close together, e.g. a phone and a smartwatch.",
          "LAN (Local Area Network): one building — a home, office, or campus Wi-Fi/Ethernet network.",
          "MAN (Metropolitan Area Network): spans a city.",
          "WAN (Wide Area Network): spans countries or continents; the Internet is the largest WAN.",
          "Topology: bus (everyone shares one cable, classic Ethernet) vs star (everyone connects to one central point, like a Wi-Fi access point or switch).",
        ],
      },
    ],
  },
  {
    id: "connecting-devices",
    title: "Connecting devices",
    entries: [
      {
        id: "repeater-bridge-switch-router",
        title: "Repeater, bridge, switch, router",
        summary: "Four devices that connect networks together — each doing a different job.",
        eli5:
          "If networks were roads: a repeater is a megaphone that repeats the same message louder so it reaches further — it just extends one network. A bridge or switch is like a roundabout joining roads that already follow the same traffic rules (compatible networks) — a switch is just a smarter bridge with more connections. A router is a border checkpoint joining roads with different rules entirely (different networks) — wire enough of these checkpoints together and you get \"an internet\": a network of networks.",
        points: [
          "Repeater: extends a single network by boosting a weak signal.",
          "Bridge: connects two compatible networks into one.",
          "Switch: connects several compatible networks/devices — a smarter, multi-port bridge.",
          "Router: connects networks that aren't directly compatible, forming a network of networks — this is literally what \"an internet\" means.",
        ],
      },
    ],
  },
  {
    id: "switching-methods",
    title: "Switching methods",
    entries: [
      {
        id: "circuit-vs-packet",
        title: "Circuit switching vs packet switching",
        summary: "Two very different ways to move data from A to B across a network.",
        eli5:
          "Circuit switching is like booking a private phone line just for your call — the whole path is reserved for you from start to finish, even during silent pauses, which wastes capacity. Packet switching is like cutting a letter into postcards, each with its own address label, and sending them through the shared postal system — postcards from lots of people share the same trucks and roads, and get reassembled at the destination. That sharing is what makes packet switching efficient for the stop-start, bursty traffic computers actually produce.",
        points: [
          "Circuit switching: connection establishment → data transfer → connection termination, with a dedicated path the whole time; great for steady voice traffic, wasteful for bursty data.",
          "Packet switching: a message is chopped into packets, each with a header, sent independently (store-and-forward), and reassembled at the destination.",
          "Packet switching lets many users share the same links, giving better utilisation for bursty computer-generated traffic.",
        ],
      },
    ],
  },
  {
    id: "client-server-p2p",
    title: "Client-server vs peer-to-peer",
    entries: [
      {
        id: "iac",
        title: "Two models for processes talking to each other",
        summary: "Who initiates contact, and who has to always be available?",
        eli5:
          "Client-server is like a restaurant: one kitchen (the server) that must always be open, serving many customers (clients) who each walk in and place an order. Peer-to-peer is like a group of friends swapping homework directly with each other — no single person has to always be around, and anyone can join or leave.",
        points: [
          "Client-server: one server, many clients; the server runs continuously; the client always initiates contact.",
          "Peer-to-peer (P2P): two processes communicate as equals; peers can be short-lived.",
        ],
      },
    ],
  },
  {
    id: "internet-isps",
    title: "The Internet & ISPs",
    entries: [
      {
        id: "isp-tiers-dns",
        title: "ISP tiers, ICANN, and DNS",
        summary: "How the physical Internet is organised, and how names turn into addresses.",
        eli5:
          "Think of the Internet's wiring like a highway system. Tier-1 ISPs (AT&T, Telstra, and similar) own the big interstate highways connecting whole countries — the backbone — and they let each other use their highways for free (\"peering\"). Tier-2 ISPs are more like regional highways. Your own home connection (Tier-3/access ISP) is the small local road that finally reaches your house, via Wi-Fi hotspot, DSL, cable, or fibre. ICANN is the organisation that hands out house numbers (IP addresses) and street names (domain names) so nothing clashes worldwide. DNS is the phonebook that looks up a street name like google.com and tells your computer its actual house number (IP address).",
        points: [
          "Tier-1 ISPs: high-speed international backbone networks; they peer with each other on a non-commercial basis.",
          "Tier-2: more regional in scope. Tier-3/Access ISP: the last-mile connection to your device (hotspot, DSL, cable/satellite, fibre).",
          "ICANN allocates IP address blocks to ISPs and oversees domain name registration.",
          "DNS (Domain Name System) translates a memorable domain name into the numeric IP address a computer actually needs.",
        ],
      },
    ],
  },
  {
    id: "security-overview",
    title: "Keeping a network secure",
    entries: [
      {
        id: "security-basics",
        title: "Attacks, protection, and encryption",
        summary: "The threats a network faces, and the standard defences against them.",
        eli5:
          "Think of your network like a house. Malware (viruses, worms, trojans, spyware) is a burglar sneaking in through an unlocked window. A denial-of-service attack is a mob blocking your front door so real visitors can't get in. A firewall is the locked gate that checks everyone before they're let onto the property. HTTPS/encryption is like sending your mail in a locked box that only the right person holds the key to — even if it's intercepted in the post, no one else can read it.",
        points: [
          "Attacks: malware (viruses, worms, trojans, spyware, phishing), denial-of-service (DoS), spam.",
          "Protection: firewalls, spam filters, proxy servers, antivirus software.",
          "HTTPS uses public-key encryption: a public key encrypts a message; only the matching private key can decrypt it — so only the intended recipient can read it, even if it's intercepted.",
          "Digital certificates, issued by certificate authorities, prove a public key genuinely belongs to the site claiming it.",
        ],
      },
    ],
  },
];
