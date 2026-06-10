import { AccountAddress } from "@aptos-labs/ts-sdk";
import { getPostgresClient } from "@/lib/db";

export type ProposalMetadata = {
  multisig_addr: string;
  seq_no: number;
  title: string;
  description: string;
};

/** Long-form lowercase so DB keys always match chain-derived addresses. */
const normalizeAddr = (addr: string) => AccountAddress.from(addr).toString();

export type UpsertProposalMetadataProps = {
  multisigAddr: string;
  seqNo: number;
  title: string;
  description: string;
};

export const upsertProposalMetadata = async ({
  multisigAddr,
  seqNo,
  title,
  description,
}: UpsertProposalMetadataProps): Promise<void> => {
  const sql = getPostgresClient();
  await sql`
    INSERT INTO proposal_metadata (multisig_addr, seq_no, title, description)
    VALUES (${normalizeAddr(multisigAddr)}, ${seqNo}, ${title}, ${description})
    ON CONFLICT (multisig_addr, seq_no)
    DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description
  `;
};

export type GetProposalMetadataProps = {
  multisigAddr: string;
};

export const getProposalMetadataByAddr = async ({
  multisigAddr,
}: GetProposalMetadataProps): Promise<ProposalMetadata[]> => {
  const sql = getPostgresClient();
  const rows = await sql`
    SELECT multisig_addr, seq_no, title, description
    FROM proposal_metadata
    WHERE multisig_addr = ${normalizeAddr(multisigAddr)}
  `;
  return rows.map((row) => ({
    multisig_addr: row.multisig_addr as string,
    seq_no: Number(row.seq_no),
    title: row.title as string,
    description: row.description as string,
  }));
};
