/**
 * Bootstraps the app's treasury multisig on testnet (plan T6) and prints the
 * address for NEXT_PUBLIC_MULTISIG_ADDRESS.
 *
 * Default: 2-of-2 owned by the publisher account + a generated owner whose
 * private key is printed (testnet throwaway — import it into a wallet to act
 * as the second signer).
 *
 * To make YOUR browser wallet an owner instead (T1 spike):
 *   bun run scripts/bootstrap-multisig.testnet.ts --owners 0xYOURWALLET[,0x..] --threshold 2
 * (publisher is always the creator/first owner; --owners adds the rest)
 */
import { Account, type Ed25519Account } from "@aptos-labs/ts-sdk";
import {
  OCTAS_PER_APT,
  createMultisig,
  formatApt,
  getPublisherAccount,
  getTestnetClient,
  submitAndWait,
} from "./lib/treasuryTestnet";

const SEED_FUNDING = OCTAS_PER_APT / 10n; // 0.1 APT so the UI shows a balance

function parseArgs(): { owners: string[]; threshold: number } {
  const argv = process.argv.slice(2);
  const get = (flag: string) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const owners = get("--owners")?.split(",").filter(Boolean) ?? [];
  const threshold = Number(get("--threshold") ?? 2);
  if (!Number.isInteger(threshold) || threshold < 1) {
    throw new Error(`invalid --threshold: ${get("--threshold")}`);
  }
  return { owners, threshold };
}

async function main() {
  const aptos = getTestnetClient();
  const publisher = getPublisherAccount();
  const { owners, threshold } = parseArgs();

  let additionalOwners = owners;
  let generated: Ed25519Account | null = null;
  if (additionalOwners.length === 0) {
    generated = Account.generate();
    additionalOwners = [generated.accountAddress.toString()];
  }
  if (threshold > additionalOwners.length + 1) {
    throw new Error(
      `threshold ${threshold} > total owners ${additionalOwners.length + 1}`,
    );
  }

  console.log(`Creator/owner 1 (publisher): ${publisher.accountAddress}`);
  additionalOwners.forEach((o, i) => console.log(`Owner ${i + 2}: ${o}`));

  const multisigAddress = await createMultisig(
    aptos,
    publisher,
    additionalOwners,
    threshold,
  );

  await submitAndWait(
    aptos,
    publisher,
    {
      function: "0x1::aptos_account::transfer",
      functionArguments: [multisigAddress, SEED_FUNDING.toString()],
    },
    `seed treasury with ${formatApt(SEED_FUNDING)}`,
  );

  console.log("\n── Bootstrap complete ──");
  console.log(`Multisig address: ${multisigAddress}`);
  console.log("\nAdd to .env:");
  console.log(`NEXT_PUBLIC_MULTISIG_ADDRESS=${multisigAddress}`);
  console.log("NEXT_PUBLIC_TREASURY_V1=true");
  if (generated) {
    console.log(
      "\nGenerated owner 2 (TESTNET THROWAWAY — needed as the second approver):",
    );
    console.log(`  address:     ${generated.accountAddress}`);
    console.log(`  private key: ${generated.privateKey.toAIP80String()}`);
    console.log(
      "Store it somewhere gitignored (e.g. .env as MULTISIG_OWNER2_PRIVATE_KEY).",
    );
  }
}

main().catch((e) => {
  console.error("\n❌ bootstrap failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
