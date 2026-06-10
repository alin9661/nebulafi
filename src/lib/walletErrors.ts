/**
 * Maps raw wallet-adapter / fullnode failures onto the explicit error states
 * the treasury UI must surface (plan T4). The wallet adapter throws plain
 * strings (WalletSignAndSubmitMessageError(...).message), and on-chain aborts
 * arrive via waitForTransaction rejections whose message embeds the
 * vm_status, e.g. "Move abort in 0x1::multisig_account: 0x507D3" — the hex is
 * the category-prefixed abort code (0x50000 permission_denied + 2003).
 * Threshold-not-met aborts with error::invalid_argument(2009) — category 0x1
 * (invalid_argument), so the canonical hex is 0x107d9.
 * Execute transactions rejected at validation (prologue) never reach the VM;
 * the fullnode returns "Invalid transaction: Type: Validation Code:
 * MULTISIG_TRANSACTION_INSUFFICIENT_APPROVALS" (or ..._PAYLOAD_DOES_NOT_MATCH)
 * with no "multisig_account" in the string, so those are matched top-level.
 */
export type TreasuryWriteError =
  | { kind: "user-rejected" }
  | { kind: "not-an-owner" }
  | { kind: "threshold-not-met" }
  | { kind: "insufficient-gas" }
  | { kind: "stale-sequence-number" }
  | { kind: "payload-mismatch" }
  | { kind: "unknown"; raw: string };

export const TREASURY_ERROR_MESSAGES: Record<
  Exclude<TreasuryWriteError["kind"], "unknown">,
  string
> = {
  "user-rejected": "Cancelled in wallet.",
  "not-an-owner": "Only multisig owners can do this.",
  "threshold-not-met": "Not enough approvals yet to execute.",
  "insufficient-gas":
    "Your account can't cover gas — fund it with testnet APT.",
  "stale-sequence-number":
    "This proposal was already resolved — refreshing the list.",
  "payload-mismatch": "Submitted payload doesn't match the stored proposal.",
};

export function mapTreasuryWriteError(e: unknown): TreasuryWriteError {
  const msg =
    typeof e === "string"
      ? e
      : e instanceof Error
        ? e.message
        : // JSON.stringify returns undefined for undefined/functions/symbols —
          // fall back to String(e) so `raw` is always a real string
          (JSON.stringify(e) ?? String(e));

  if (/reject|declined|denied by user|user cancel/i.test(msg)) {
    return { kind: "user-rejected" };
  }
  if (/multisig_account/.test(msg)) {
    // Abort codes from 0x1::multisig_account, matched both as raw decimal
    // and category-prefixed hex as rendered in vm_status strings.
    if (/0x507d3|\b2003\b/i.test(msg)) return { kind: "not-an-owner" };
    if (/0x107d9|\b2009\b/i.test(msg)) return { kind: "threshold-not-met" };
    if (/0x107da|0x107d8|\b2010\b|\b2008\b/i.test(msg)) {
      return { kind: "payload-mismatch" };
    }
    if (/0x10011\b|\b17\b/.test(msg)) return { kind: "stale-sequence-number" };
  }
  if (/INSUFFICIENT_BALANCE|insufficient.*gas|gas.*insufficient/i.test(msg)) {
    return { kind: "insufficient-gas" };
  }
  if (/SEQUENCE_NUMBER_TOO_OLD/i.test(msg)) {
    return { kind: "stale-sequence-number" };
  }
  if (/MULTISIG_TRANSACTION_INSUFFICIENT_APPROVALS/i.test(msg)) {
    return { kind: "threshold-not-met" };
  }
  if (/MULTISIG_TRANSACTION_PAYLOAD_DOES_NOT_MATCH/i.test(msg)) {
    return { kind: "payload-mismatch" };
  }
  return { kind: "unknown", raw: msg };
}
