import type { BasicsGroup } from "@/lib/basics";

export const networkSystemsFundamentalsGroups: BasicsGroup[] = [
  {
    id: "what-is-a-network",
    title: "What is a computer network?",
    entries: [
      {
        id: "network-definition",
        title: "A network is devices connected so they can communicate",
        summary: "A collection of computers and other devices connected together so that they can communicate and share resources.",
        eli5:
          "Twenty computers sitting in the same room, each completely unplugged from every other one, are not a network — they're just twenty separate computers that happen to share a room. A network only exists once those devices are actually connected in a way that lets them talk to each other or share something.",
        points: [
          "A computer network is a collection of computers and other devices connected together so they can communicate and share resources.",
          "Resources that can be shared: files, printers, applications, storage, Internet connections, and other network services.",
          "Key idea: a network is not simply a collection of computers — the devices must be connected in a way that allows communication or resource sharing.",
          "Example: a lab of 40 computers connected so students can access the Internet, share files, and use a common printer is a computer network.",
        ],
      },
    ],
  },
  {
    id: "network-devices",
    title: "The devices that make up a network",
    entries: [
      {
        id: "end-devices-nic",
        title: "End devices and the NIC",
        summary: "An end device sends or receives information; a NIC is what lets it connect at all.",
        eli5:
          "An end device is anything at the \"edge\" of the network that actually generates or consumes data — your laptop, your phone, a printer, an IoT sensor. But an end device can't join a network on its own; it needs a Network Interface Card (NIC), the hardware that physically connects it, wired (Ethernet) or wireless. Every NIC has a unique hardware address burned in called a MAC address — like a serial number no two NICs share.",
        points: [
          "End device: sends or receives information over a network — desktops, laptops, smartphones, tablets, printers, servers, IoT devices.",
          "Network Interface Card (NIC): enables a device to connect to a network, via wired Ethernet or wireless connectivity.",
          "A NIC normally has a hardware address called a MAC address.",
          "Example: a desktop computer may use an Ethernet NIC to connect to a network switch through an Ethernet cable.",
        ],
      },
      {
        id: "switch-vs-router-vs-ap",
        title: "Switch, router, and wireless access point",
        summary: "Three devices that all 'connect' things, but at completely different scopes.",
        eli5:
          "A switch is the hub of one room: it connects devices within a single Local Area Network (LAN) and uses MAC addresses to decide where to forward each frame. A router is the door out of that room: it connects different networks together and uses IP addresses to decide where to forward each packet. An access point is a wireless doorway into that same room: it lets Wi-Fi devices like laptops and phones join the LAN without a cable, then hands their traffic off to the switch.",
        points: [
          "Switch: connects devices within a LAN; forwards frames primarily using MAC addresses.",
          "Router: connects different networks and forwards packets between them; makes forwarding decisions primarily using IP addresses.",
          "Remember the split: switch = communication within a LAN; router = communication between networks.",
          "Wireless Access Point (AP): enables wireless devices (laptops, smartphones, tablets) to join a network over Wi-Fi, typically feeding into a switch.",
        ],
      },
      {
        id: "servers-and-clients",
        title: "Servers, clients, and the five common server types",
        summary: "A server provides a service; the computer requesting it is called a client.",
        eli5:
          "A server is just a computer (or program) whose whole job is to answer requests from other computers. Your laptop asks a web server for a page; the web server responds with the page. Your laptop is the client — the one asking — and never the other way around for that exchange.",
        points: [
          "Server: a computer or program that provides a service to other computers on a network. The requesting computers are clients.",
          "Web server: provides webpages.",
          "File server: stores and shares files.",
          "Mail server: provides email services.",
          "DNS server: helps translate domain names into IP addresses.",
          "DHCP server: provides IP configuration information automatically.",
        ],
      },
      {
        id: "modem-ont",
        title: "Modem and ONT — where the ISP's connection ends and yours begins",
        summary: "The exact piece of equipment that terminates the Internet Service Provider's link into your building.",
        eli5:
          "Think of the ISP's connection like a water pipe running from the street into your house. Somewhere it has to stop and connect to your own household plumbing — that connection point is the modem (for cable/DSL) or the ONT, Optical Network Terminal (for fibre). An ONT specifically terminates a fibre-optic connection and hands off a usable electrical/data interface that your own router can plug into.",
        points: [
          "An Internet Service Provider (ISP) provides connectivity between an organisation and the Internet.",
          "Depending on the access technology used, equipment such as a modem or an Optical Network Terminal (ONT) terminates the ISP's connection.",
          "An ONT terminates a fibre-optic connection and provides an interface the customer's own networking equipment (the router) can use.",
        ],
      },
    ],
  },
  {
    id: "transmission-media-and-bandwidth",
    title: "Transmission media & bandwidth",
    entries: [
      {
        id: "guided-vs-unguided-media",
        title: "Guided (wired) vs unguided (wireless) media",
        summary: "A transmission medium is the physical path data actually travels along.",
        eli5:
          "Guided media are cables — the signal is physically \"guided\" down a wire or fibre, like water forced through a pipe. Unguided media are wireless — the signal just radiates out through the air, like sound from a speaker, and anything in range can pick it up.",
        points: [
          "Guided/wired media: twisted-pair cable, coaxial cable, fibre-optic cable.",
          "Unguided/wireless media: Wi-Fi radio waves, microwave communication, satellite communication.",
          "Twisted-pair Ethernet cable: relatively inexpensive, easy to install, suitable for many LAN environments — the typical choice for connecting desktop computers to a switch.",
          "Fibre-optic cable: transmits information using light; particularly useful when high bandwidth is required, longer distances must be covered, or resistance to electromagnetic interference matters — e.g. linking two buildings.",
          "Wireless (Wi-Fi): lets devices communicate without physical cables — the standard choice for smartphones, tablets, and laptops moving around a building.",
        ],
      },
      {
        id: "bandwidth-concept",
        title: "Bandwidth: how much data a link can carry",
        summary: "Bandwidth is the amount of data a communication link can carry within a given period, measured in bps/Kbps/Mbps/Gbps.",
        eli5:
          "Bandwidth is the width of the pipe, not how far the water has to travel. A 100 Mbps connection can carry ten times as much data per second as a 10 Mbps connection. The right amount of bandwidth to provision depends entirely on how many users there are and what they're doing — a handful of people browsing text pages need almost nothing; the same number running video conferencing, cloud services, video streaming, or large file transfers can need enormous amounts.",
        points: [
          "Bandwidth: the amount of data a communication link can carry within a given period — measured in bps, Kbps, Mbps, and Gbps.",
          "A higher number means more capacity: a 100 Mbps connection has ten times the bandwidth of a 10 Mbps connection.",
          "Bandwidth should be selected according to the number of users and the applications they'll actually run.",
          "High-bandwidth-hungry applications: video conferencing, cloud services, video streaming, large file transfers.",
        ],
      },
    ],
  },
  {
    id: "network-topologies",
    title: "Network topologies: bus, star, ring",
    entries: [
      {
        id: "topology-definition",
        title: "What a topology actually describes",
        summary: "A network topology describes how devices and communication links are arranged.",
        eli5:
          "Topology answers one question only: physically or logically, how are the wires (or wireless links) laid out between devices? It says nothing about addressing, protocols, or what data is sent — just the shape of the connections.",
        points: [
          "Network topology: how network devices and communication links are arranged.",
          "The three classic topologies to know cold: bus, star, and ring.",
        ],
      },
      {
        id: "bus-topology",
        title: "Bus topology",
        summary: "Every device shares one common cable, called the backbone.",
        eli5:
          "Imagine one long hallway (the backbone cable) with every device's door opening directly onto it. Anyone can send a message down the hallway, and everyone else can potentially hear it. It needs very little cable, but if that one hallway gets blocked (the backbone fails), nobody can talk to anybody.",
        points: [
          "Devices share a common communication cable called a backbone.",
          "Advantages: requires relatively little cable, can be inexpensive for small networks, conceptually simple.",
          "Disadvantages: failure of the backbone can affect the entire network, troubleshooting may be difficult, performance may decrease as traffic increases.",
          "Traditional bus Ethernet networks are uncommon in modern LAN installations.",
        ],
      },
      {
        id: "star-topology",
        title: "Star topology",
        summary: "Every device connects individually to one central device, commonly a switch.",
        eli5:
          "Now imagine every device has its own private hallway leading straight to one central hub. Adding a new device just means running one new hallway to the hub — nobody else is affected, and if your hallway breaks, only you lose connectivity. But the hub itself is now the one thing that, if it fails, takes everyone down at once.",
        points: [
          "Every device connects to a central networking device, commonly a switch.",
          "Advantages: easy to add devices, easy to troubleshoot, failure of one device's connection normally affects only that device, good performance when switches are used.",
          "Disadvantages: requires more cabling than a bus topology, failure of the central switch can affect the entire network, requires a central networking device.",
          "Modern Ethernet LANs commonly use a star topology.",
        ],
      },
      {
        id: "ring-topology",
        title: "Ring topology",
        summary: "Devices connect to their neighbours on each side, forming a closed loop.",
        eli5:
          "Picture everyone standing in a circle, only able to pass a note to the person immediately to their left and right. Communication can be organised very systematically this way (everyone gets a predictable turn), but adding or removing a person means breaking and re-forming part of the circle, and in a simple ring, one broken link can disrupt the whole loop.",
        points: [
          "Devices are connected to neighbouring devices to form a ring.",
          "Advantages: communication can be organised systematically; some ring technologies provide predictable access to the transmission medium.",
          "Disadvantages: failure of a device or connection can disrupt some simple ring networks; adding or removing devices may be more difficult; less common in modern LAN installations.",
        ],
      },
      {
        id: "choosing-a-topology",
        title: "Choosing a topology — and justifying the choice",
        summary: "The choice should be based on network requirements, not on which topology is most familiar.",
        eli5:
          "A network designer shouldn't pick a topology just because it's the one they know best. The right question is always: given the number of users, the budget, how reliable it needs to be, whether it needs to grow, and how easy it needs to be to troubleshoot — which arrangement actually satisfies those requirements? On an exam, never just name a topology — always give the reason, tied back to the requirement.",
        points: [
          "Factors to weigh: number of users, cost, reliability, scalability, security, physical location, transmission medium, bandwidth, ease of troubleshooting, future expansion.",
          "Justification structure to use in every answer: Choice + Reason + Relationship to the requirement.",
          "Weak answer: \"I will use star topology.\" Better answer: \"I will use a star topology because each computer can have an independent connection to the central switch — this makes individual connection faults easier to isolate and allows additional computers to be added relatively easily.\"",
        ],
      },
    ],
  },
  {
    id: "scalability-and-design",
    title: "Scalability & network design",
    entries: [
      {
        id: "scalability-concept",
        title: "Scalability: designing for growth, not just today",
        summary: "The ability of a network to accommodate growth without requiring a complete redesign.",
        eli5:
          "A scalable network is built with headroom — like buying a house with an extra bedroom you don't need yet, because you know the family is growing. A good designer thinks ahead: if a lab needs 30 computers today but 60 in three years, the switch capacity, IP addressing scheme, cabling, and bandwidth should all be chosen so that growth doesn't force starting over from scratch.",
        points: [
          "Scalability: the ability of a network to accommodate growth without requiring a complete redesign.",
          "A good designer provides sufficient switch capacity, room for additional switches, adequate IP addressing capacity, sufficient bandwidth, and appropriate cabling up front.",
          "Good network design considers both present requirements and future requirements — never just today's headcount.",
        ],
      },
      {
        id: "network-design-methodology",
        title: "The network design methodology, end to end",
        summary: "Start from requirements, not from a favourite technology.",
        eli5:
          "Don't ask \"which topology do I know?\" — ask \"what does this network actually need to achieve?\" Everything else follows in order from that one question: the requirements shape the topology, the topology shapes which devices you need, that shapes the transmission media, which shapes the bandwidth, then you plan Internet connectivity, scalability, and security on top.",
        points: [
          "Design flow: Requirements → Topology → Network Devices → Transmission Media → Bandwidth → Internet Connectivity → Scalability → Security.",
          "A good network design satisfies the requirements of its users today while allowing the network to operate securely and grow in the future.",
          "Worked example: a 40-computer lab with a printer, a server, and Internet access, expected to expand — star topology (easy to add computers, faults easy to isolate), twisted-pair Ethernet to the switch, a router + ISP termination equipment for Internet access, extra switch/port/bandwidth headroom for scalability, and firewall/authentication/malware protection/backups for security.",
        ],
      },
    ],
  },
  {
    id: "network-security-and-safety",
    title: "Network security & Internet safety",
    entries: [
      {
        id: "password-security",
        title: "Good password practices",
        summary: "The first and cheapest line of defence for any account or device.",
        eli5:
          "A password is like the lock on your front door. A short, guessable one (your name, your birthday) is like leaving the key under the mat — technically locked, but not really protecting anything. Using the same password everywhere is like using one key for your house, your car, and your office: lose it once, lose everything at once.",
        points: [
          "Use sufficiently long passwords.",
          "Avoid easily guessed personal information (birthdays, names, \"password123\").",
          "Use different passwords for important services — one leaked password shouldn't unlock everything.",
          "Keep passwords private.",
          "Use multi-factor authentication where it's available.",
        ],
      },
      {
        id: "internet-safety",
        title: "Internet safety habits",
        summary: "Simple, consistent habits that avoid the vast majority of everyday online risk.",
        eli5:
          "Think of the Internet like a busy street market: most stalls are genuine, but a few are scams designed to look exactly like a real one. Verifying a site before typing in a password is like checking you're actually at the bank's counter and not a lookalike stand set up next to it — a small pause that avoids handing your details straight to a stranger.",
        points: [
          "Avoid suspicious websites.",
          "Avoid unknown links and attachments.",
          "Verify a website before providing sensitive information.",
          "Recognise phishing attempts — messages designed to trick you into revealing credentials or personal data.",
          "Avoid unnecessarily sharing personal information.",
          "Use secure Internet services.",
        ],
      },
      {
        id: "malware-awareness",
        title: "Malware awareness",
        summary: "Malicious software designed to damage, disrupt, spy on, or gain unauthorised access to systems.",
        eli5:
          "Malware is an umbrella term — viruses attach to and spread through files, worms spread on their own across a network, Trojan horses disguise themselves as something harmless, spyware quietly watches what you do, and ransomware locks your files and demands payment to release them. Different mechanisms, same underlying goal: get access or cause harm without permission.",
        points: [
          "Malware examples: viruses, worms, Trojan horses, spyware, ransomware.",
          "Keep software updated — many attacks exploit known, already-patched vulnerabilities.",
          "Use appropriate security software.",
          "Avoid suspicious downloads and unexpected attachments.",
          "Use removable storage (USB drives, external disks) carefully — a common infection vector.",
        ],
      },
      {
        id: "data-backup",
        title: "Data backup",
        summary: "A backup is an additional copy of data kept so it can be recovered if the original is lost or damaged.",
        eli5:
          "A backup is like keeping a photocopy of an important document in a different drawer. If the original gets lost, damaged, or someone spills coffee on it, the copy in the other drawer means nothing important is actually gone for good.",
        points: [
          "Data can be lost through hardware failure, malware, theft, accidental deletion, or disasters.",
          "Back up important information regularly — a backup you haven't taken yet doesn't help you.",
        ],
      },
      {
        id: "securing-personal-devices",
        title: "Securing personal devices",
        summary: "Laptops, smartphones, and tablets need the same discipline as any networked server.",
        eli5:
          "It's easy to think of \"network security\" as something only servers and switches need. But your own laptop or phone is also a device on the network, and if it's left unlocked, out of date, or full of untrusted apps, it becomes the weak link an attacker actually goes through — the same discipline that protects a server protects your own device too.",
        points: [
          "Use passwords, PINs, or biometrics to lock the device.",
          "Install software updates promptly.",
          "Lock devices when unattended.",
          "Avoid untrusted/unofficial software.",
          "Enable appropriate built-in security features.",
          "Back up important information from personal devices too.",
        ],
      },
    ],
  },
];
