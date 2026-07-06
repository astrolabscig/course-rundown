// All IPv4 arithmetic is done as unsigned 32-bit integers via `>>> 0`.
// Using `<<` directly on values with the sign bit set (first octet >= 128)
// produces negative numbers in JS, so we build the integer with
// multiplication instead of left-shifting, then normalise with `>>> 0`.

export interface Octets {
  o1: number;
  o2: number;
  o3: number;
  o4: number;
}

export function parseIp(ip: string): Octets | null {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return null;
  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null;
  const [o1, o2, o3, o4] = nums;
  return { o1, o2, o3, o4 };
}

export function octetsToUint32({ o1, o2, o3, o4 }: Octets): number {
  return (o1 * 16777216 + o2 * 65536 + o3 * 256 + o4) >>> 0;
}

export function uint32ToOctets(n: number): Octets {
  const u = n >>> 0;
  return {
    o1: (u >>> 24) & 255,
    o2: (u >>> 16) & 255,
    o3: (u >>> 8) & 255,
    o4: u & 255,
  };
}

export function uint32ToDotted(n: number): string {
  const { o1, o2, o3, o4 } = uint32ToOctets(n);
  return `${o1}.${o2}.${o3}.${o4}`;
}

export function ipToDotted(o: Octets): string {
  return `${o.o1}.${o.o2}.${o.o3}.${o.o4}`;
}

export function toBinaryOctet(n: number): string {
  return n.toString(2).padStart(8, "0");
}

export function ipToBinary(o: Octets): string {
  return `${toBinaryOctet(o.o1)}.${toBinaryOctet(o.o2)}.${toBinaryOctet(o.o3)}.${toBinaryOctet(o.o4)}`;
}

/** Prefix length (0-32) -> uint32 mask, e.g. 24 -> 255.255.255.0 */
export function prefixToMaskUint32(prefix: number): number {
  if (prefix <= 0) return 0;
  if (prefix >= 32) return 0xffffffff >>> 0;
  return (0xffffffff << (32 - prefix)) >>> 0;
}

/** uint32 mask -> prefix length (0-32), or null if not a valid contiguous mask */
export function maskUint32ToPrefix(mask: number): number | null {
  const u = mask >>> 0;
  let prefix = 0;
  let seenZero = false;
  for (let i = 31; i >= 0; i--) {
    const bit = (u >>> i) & 1;
    if (bit === 1) {
      if (seenZero) return null; // not contiguous
      prefix++;
    } else {
      seenZero = true;
    }
  }
  return prefix;
}

export type IPClass = "A" | "B" | "C" | "D" | "E";

export function classify(o1: number): IPClass {
  if (o1 < 128) return "A";
  if (o1 < 192) return "B";
  if (o1 < 224) return "C";
  if (o1 < 240) return "D";
  return "E";
}

export const DEFAULT_PREFIX_BY_CLASS: Record<IPClass, number | null> = {
  A: 8,
  B: 16,
  C: 24,
  D: null, // multicast, no host/network split
  E: null, // reserved/experimental
};

export function isPrivate(o: Octets): boolean {
  if (o.o1 === 10) return true;
  if (o.o1 === 172 && o.o2 >= 16 && o.o2 <= 31) return true;
  if (o.o1 === 192 && o.o2 === 168) return true;
  return false;
}

export function isLoopback(o: Octets): boolean {
  return o.o1 === 127;
}

export function isBroadcast(o: Octets): boolean {
  return o.o1 === 255 && o.o2 === 255 && o.o3 === 255 && o.o4 === 255;
}

export function isThisNetwork(o: Octets): boolean {
  return o.o1 === 0 && o.o2 === 0 && o.o3 === 0 && o.o4 === 0;
}

export interface SubnetResult {
  ip: Octets;
  prefix: number;
  maskUint32: number;
  networkUint32: number;
  broadcastUint32: number;
  hostBits: number;
  totalAddresses: number;
  usableHosts: number;
  firstUsableUint32: number;
  lastUsableUint32: number;
}

export function calculateSubnet(ip: Octets, prefix: number): SubnetResult {
  const ipInt = octetsToUint32(ip);
  const maskUint32 = prefixToMaskUint32(prefix);
  const networkUint32 = (ipInt & maskUint32) >>> 0;
  const wildcard = (~maskUint32) >>> 0;
  const broadcastUint32 = (networkUint32 | wildcard) >>> 0;
  const hostBits = 32 - prefix;
  const totalAddresses = Math.pow(2, hostBits);
  const usableHosts = Math.max(0, totalAddresses - 2);
  const firstUsableUint32 = hostBits > 0 ? (networkUint32 + 1) >>> 0 : networkUint32;
  const lastUsableUint32 = hostBits > 0 ? (broadcastUint32 - 1) >>> 0 : broadcastUint32;

  return {
    ip,
    prefix,
    maskUint32,
    networkUint32,
    broadcastUint32,
    hostBits,
    totalAddresses,
    usableHosts,
    firstUsableUint32,
    lastUsableUint32,
  };
}
