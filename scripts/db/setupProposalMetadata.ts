/**
 * One-time Neon setup for Treasury M1 off-chain proposal metadata.
 * Run: bun run db:setup:treasury
 *
 * Deliberately NOT a Diesel migration: M1 forbids indexer/Diesel changes,
 * and this table is owned by the frontend, not the indexer pipeline.
 * Only human-readable labels live here — money facts stay on-chain.
 */
import { neon } from "@neondatabase/serverless";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL not set in .env");
  const sql = neon(databaseUrl);

  await sql`
    CREATE TABLE IF NOT EXISTS proposal_metadata (
      multisig_addr TEXT NOT NULL,
      seq_no BIGINT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (multisig_addr, seq_no)
    )
  `;
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM proposal_metadata`;
  console.log(`✓ proposal_metadata ready (${count} rows)`);
}

main().catch((e) => {
  console.error("❌ setup failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
