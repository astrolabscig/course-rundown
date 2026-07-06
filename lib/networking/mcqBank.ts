import type { MCQ } from "@/lib/mcqBank";

export const networkingMcqBank: MCQ[] = [
  {
    id: "n-mcq-1",
    question: "A host has IP 192.168.10.70 with mask 255.255.255.192 (/26). What is its network address?",
    options: ["192.168.10.0", "192.168.10.64", "192.168.10.128", "192.168.10.192"],
    correctIndex: 1,
    explanation:
      "70 in binary is 01000110; ANDed with the mask's last octet 11000000 (192) gives 01000000 = 64. So the network address is 192.168.10.64.",
  },
  {
    id: "n-mcq-2",
    question: "How many usable host addresses does a /28 subnet provide?",
    options: ["16", "14", "30", "32"],
    correctIndex: 1,
    explanation:
      "/28 leaves 4 host bits, so 2^4 = 16 total addresses. Subtracting the network and broadcast addresses (never assignable to a host) leaves 14 usable.",
  },
  {
    id: "n-mcq-3",
    question: "Which IPv4 address class does 200.15.6.4 belong to?",
    options: ["Class A", "Class B", "Class C", "Class D"],
    correctIndex: 2,
    explanation: "First-octet ranges: A = 0-127, B = 128-191, C = 192-223, D = 224-239. 200 falls in the class C range.",
  },
  {
    id: "n-mcq-4",
    question: "What does the /24 in CIDR notation like 10.0.5.0/24 actually specify?",
    options: [
      "The encryption strength used on the connection",
      "How many leftmost bits of the address count as the network portion",
      "The physical length of the network cable",
      "The maximum number of packets per second",
    ],
    correctIndex: 1,
    explanation:
      "CIDR's /n is simply the prefix length — the number of leftmost bits treated as the network part, replacing the old fixed class A/B/C boundaries.",
  },
  {
    id: "n-mcq-5",
    question: "Borrowing 3 bits from a Class C network's host portion creates how many subnets?",
    options: ["4", "6", "8", "16"],
    correctIndex: 2,
    explanation: "Each borrowed bit doubles the number of subnets: 2^3 = 8 subnets.",
  },
  {
    id: "n-mcq-6",
    question: "Which protocol sits on top of IP and adds reliability — resending lost packets and keeping them in order?",
    options: ["UDP", "TCP", "ARP", "ICMP"],
    correctIndex: 1,
    explanation:
      "TCP is connection-oriented and reliable: it splits messages into packets, reassembles them in order, and resends anything lost. IP itself makes no such guarantees.",
  },
  {
    id: "n-mcq-7",
    question: "Why can't Wi-Fi detect collisions the same way wired Ethernet does?",
    options: [
      "Wi-Fi doesn't use radio waves",
      "A wireless device can't reliably transmit and listen for other signals at the same time",
      "Wireless packets are too small to collide",
      "Collisions cannot physically happen over the air",
    ],
    correctIndex: 1,
    explanation:
      "An Ethernet device can listen while it transmits, so it can notice a collision as it happens. A Wi-Fi radio's own transmission drowns out anything else, so it can't listen at the same time — hence collision avoidance (CSMA/CA) instead of detection.",
  },
  {
    id: "n-mcq-8",
    question: "Compared to a switch, a router's defining job is to:",
    options: [
      "Connect networks with different/incompatible addressing into a network of networks (an internet)",
      "Simply extend one network's signal range",
      "Only ever operate within a single LAN",
      "Encrypt all traffic that passes through it",
    ],
    correctIndex: 0,
    explanation:
      "A switch connects several compatible devices/networks. A router specifically connects networks that aren't directly compatible — wiring enough routers together is literally what \"an internet\" means.",
  },
  {
    id: "n-mcq-9",
    question: "In binary, how does a subnet's broadcast address relate to its network address?",
    options: [
      "All host bits set to 0",
      "All host bits set to 1",
      "Only the first host bit set to 1",
      "It's identical to the network address",
    ],
    correctIndex: 1,
    explanation:
      "The network address has all host bits at 0; the broadcast address is the same network prefix with every host bit flipped to 1 — the highest address in the block.",
  },
  {
    id: "n-mcq-10",
    question:
      "A network needs 3 subnets sized for 110, 45, and 50 hosts from a single Class C network. Why can't one fixed subnet mask satisfy all three?",
    options: [
      "A single fixed mask forces every subnet to be the same size, but these departments need different sizes",
      "Class C networks cannot be subnetted at all",
      "CIDR blocks are not allowed to be split further",
      "VLSM only works on Class A and B networks",
    ],
    correctIndex: 0,
    explanation:
      "One subnet mask always produces equal-sized subnets. Since the three requirements are all different sizes, no single mask can fit all of them without wasting a lot of addresses — that's exactly the problem VLSM (Variable Length Subnet Masking) solves.",
  },
];
