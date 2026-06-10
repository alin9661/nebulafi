export const OCTAS_PER_APT = 100_000_000n;

/** "12,345.0001 APT"-style display; bigint-safe, trailing zeros trimmed. */
export const formatApt = (octas: bigint): string => {
  const negative = octas < 0n;
  const abs = negative ? -octas : octas;
  const whole = abs / OCTAS_PER_APT;
  const frac = (abs % OCTAS_PER_APT).toString().padStart(8, "0").replace(/0+$/, "");
  const wholeGrouped = whole.toLocaleString("en-US");
  return `${negative ? "−" : ""}${wholeGrouped}${frac ? `.${frac}` : ""}`;
};

/** Parse a user-entered APT amount ("0.05") into octas; null when invalid. */
export const parseAptToOctas = (input: string): bigint | null => {
  const match = /^(\d+)(?:\.(\d{1,8}))?$/.exec(input.trim());
  if (!match) return null;
  const [, whole, frac = ""] = match;
  const octas =
    BigInt(whole) * OCTAS_PER_APT + BigInt(frac.padEnd(8, "0") || "0");
  return octas > 0n ? octas : null;
};

/** "0x9a58…cdbd" display form for long addresses. */
export const shortAddr = (addr: string): string =>
  addr.length > 14 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
