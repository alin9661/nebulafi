/**
 * Treasury M1 E2E (testnet): proves the full multisig loop with the exact
 * payload encoding the app uses (src/lib/multisigPayload.ts).
 *
 *   bootstrap fresh 2-of-2 → deposit → propose → approve → execute
 *
 * Fresh multisig per run keeps sequence-number assertions deterministic.
 * Publisher (from .env) is owner 1; a generated throwaway account is owner 2.
 * Run: bun run test:e2e:treasury   (testnet only; spends ~0.2 testnet APT)
 */
import { Account } from "@aptos-labs/ts-sdk";
import { encodeAptTransferPayload } from "../src/lib/multisigPayload";
import {
  OCTAS_PER_APT,
  createMultisig,
  formatApt,
  getAptBalance,
  getPublisherAccount,
  getTestnetClient,
  submitAndWait,
} from "./lib/treasuryTestnet";

const OWNER2_FUNDING = OCTAS_PER_APT / 10n; // 0.1 APT for owner 2 gas
const DEPOSIT = OCTAS_PER_APT / 20n; // 0.05 APT into the treasury
const TRANSFER_OUT = OCTAS_PER_APT / 100n; // 0.01 APT proposed out
const MIN_PUBLISHER_BALANCE = OCTAS_PER_APT / 2n; // sanity floor incl. gas

const assert = (cond: boolean, msg: string) => {
  if (!cond) throw new Error(`ASSERTION FAILED: ${msg}`);
};

async function main() {
  const aptos = getTestnetClient();
  const publisher = getPublisherAccount();
  const owner2 = Account.generate();
  const recipient = Account.generate(); // receives the proposed transfer

  console.log(`Publisher (owner 1): ${publisher.accountAddress}`);
  console.log(`Owner 2 (generated): ${owner2.accountAddress}`);
  console.log(`Recipient (generated): ${recipient.accountAddress}`);

  const publisherBalance = await getAptBalance(
    aptos,
    publisher.accountAddress.toString(),
  );
  assert(
    publisherBalance >= MIN_PUBLISHER_BALANCE,
    `publisher needs ≥ ${formatApt(MIN_PUBLISHER_BALANCE)}, has ${formatApt(publisherBalance)} — fund it on testnet`,
  );

  console.log("\n[1/6] Fund owner 2 (faucet is auth-gated; transfer instead)");
  await submitAndWait(
    aptos,
    publisher,
    {
      function: "0x1::aptos_account::transfer",
      functionArguments: [owner2.accountAddress.toString(), OWNER2_FUNDING.toString()],
    },
    `fund owner2 with ${formatApt(OWNER2_FUNDING)}`,
  );

  console.log("\n[2/6] Create fresh 2-of-2 multisig");
  const multisigAddress = await createMultisig(
    aptos,
    publisher,
    [owner2.accountAddress.toString()],
    2,
  );

  console.log("\n[3/6] Deposit into the treasury");
  await submitAndWait(
    aptos,
    publisher,
    {
      function: "0x1::aptos_account::transfer",
      functionArguments: [multisigAddress, DEPOSIT.toString()],
    },
    `deposit ${formatApt(DEPOSIT)}`,
  );
  const treasuryBalance = await getAptBalance(aptos, multisigAddress);
  assert(
    treasuryBalance === DEPOSIT,
    `treasury balance ${treasuryBalance} !== deposit ${DEPOSIT}`,
  );

  console.log("\n[4/6] Propose transfer (create_transaction, app's encoder)");
  const payload = encodeAptTransferPayload({
    recipient: recipient.accountAddress.toString(),
    amountOctas: TRANSFER_OUT,
  });
  await submitAndWait(
    aptos,
    publisher,
    {
      function: "0x1::multisig_account::create_transaction",
      functionArguments: [multisigAddress, payload],
    },
    "create_transaction (seq 1)",
  );

  // Creator's vote should be auto-recorded as approval — verify, don't assume.
  const [voted, vote] = await aptos.view<[boolean, boolean]>({
    payload: {
      function: "0x1::multisig_account::vote",
      functionArguments: [
        multisigAddress,
        "1",
        publisher.accountAddress.toString(),
      ],
    },
  });
  console.log(`  creator auto-vote: voted=${voted}, approve=${vote}`);
  if (!voted || !vote) {
    await submitAndWait(
      aptos,
      publisher,
      {
        function: "0x1::multisig_account::approve_transaction",
        functionArguments: [multisigAddress, "1"],
      },
      "approve_transaction (owner 1)",
    );
  }

  console.log("\n[5/6] Approve with owner 2, wait for executability");
  await submitAndWait(
    aptos,
    owner2,
    {
      function: "0x1::multisig_account::approve_transaction",
      functionArguments: [multisigAddress, "1"],
    },
    "approve_transaction (owner 2)",
  );

  let canExecute = false;
  for (let i = 0; i < 10 && !canExecute; i++) {
    [canExecute] = await aptos.view<[boolean]>({
      payload: {
        function: "0x1::multisig_account::can_be_executed",
        functionArguments: [multisigAddress, "1"],
      },
    });
    if (!canExecute) await new Promise((r) => setTimeout(r, 1000));
  }
  assert(canExecute, "can_be_executed(seq 1) never became true");

  console.log("\n[6/6] Execute as multisig (TransactionPayloadMultiSig)");
  await submitAndWait(
    aptos,
    publisher,
    {
      multisigAddress,
      function: "0x1::aptos_account::transfer",
      functionArguments: [
        recipient.accountAddress.toString(),
        TRANSFER_OUT.toString(),
      ],
    },
    "execute multisig transfer",
  );

  const recipientBalance = await getAptBalance(
    aptos,
    recipient.accountAddress.toString(),
  );
  assert(
    recipientBalance === TRANSFER_OUT,
    `recipient got ${recipientBalance}, expected ${TRANSFER_OUT}`,
  );

  const [lastResolved] = await aptos.view<[string]>({
    payload: {
      function: "0x1::multisig_account::last_resolved_sequence_number",
      functionArguments: [multisigAddress],
    },
  });
  assert(lastResolved === "1", `last_resolved_sequence_number ${lastResolved} !== 1`);

  const [pending] = await aptos.view<[unknown[]]>({
    payload: {
      function: "0x1::multisig_account::get_pending_transactions",
      functionArguments: [multisigAddress],
    },
  });
  assert(pending.length === 0, `expected no pending txns, found ${pending.length}`);

  console.log(`\n✅ E2E PASSED — multisig ${multisigAddress}`);
  console.log(
    `   deposit ${formatApt(DEPOSIT)} → propose → 2/2 approve → execute ${formatApt(TRANSFER_OUT)} → recipient credited, seq 1 resolved, queue empty`,
  );
}

main().catch((e) => {
  console.error("\n❌ E2E FAILED:", e instanceof Error ? e.message : e);
  process.exit(1);
});
