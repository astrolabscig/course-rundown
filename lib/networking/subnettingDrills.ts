export interface SubnettingScenario {
  id: string;
  prompt: string;
  ip: string;
  prefix: number;
}

// Expected answers are computed live from `ip`/`prefix` via calculateSubnet(),
// so there's no risk of the drill data disagreeing with the calculator.
export const subnettingScenarios: SubnettingScenario[] = [
  {
    id: "s1",
    prompt: "A host has address 200.10.5.68 with mask /28. Which subnet is it on?",
    ip: "200.10.5.68",
    prefix: 28,
  },
  {
    id: "s2",
    prompt: "A department is given 172.20.130.5/20. Find its subnet's usable host range.",
    ip: "172.20.130.5",
    prefix: 20,
  },
  {
    id: "s3",
    prompt: "A server has 10.1.1.1 with the default class A mask (no subnetting). What's its network address?",
    ip: "10.1.1.1",
    prefix: 8,
  },
  {
    id: "s4",
    prompt: "A printer at 192.168.5.130 uses mask /26. What is the broadcast address of its subnet?",
    ip: "192.168.5.130",
    prefix: 26,
  },
  {
    id: "s5",
    prompt: "144.16.72.57 is subnetted with mask 255.255.192.0. How many bits were borrowed from the class default, and how many subnets does that create?",
    ip: "144.16.72.57",
    prefix: 18,
  },
  {
    id: "s6",
    prompt: "A host at 192.203.17.150 sits on a /26-masked subnet (the same scheme as the VLSM example). What's its usable host range?",
    ip: "192.203.17.150",
    prefix: 26,
  },
];
