import { getPostgresClient } from "@/lib/db";
import { Message } from "@/lib/type/message";

export type GetMessagesProps = {
  page: number;
  limit: number;
  sortedBy: "creation_timestamp";
  order: "ASC" | "DESC";
};

const ALLOWED_SORT_COLUMNS = new Set(["creation_timestamp"]);
const ALLOWED_SORT_ORDERS = new Set(["ASC", "DESC"]);

export const getMessages = async ({
  page,
  limit,
  sortedBy,
  order,
}: GetMessagesProps): Promise<{
  messages: Message[];
  total: number;
}> => {
  if (!ALLOWED_SORT_COLUMNS.has(sortedBy)) {
    throw new Error(`invalid sort column: ${sortedBy}`);
  }
  if (!ALLOWED_SORT_ORDERS.has(order)) {
    throw new Error(`invalid sort order: ${order}`);
  }
  if (!Number.isInteger(page) || page < 1) {
    throw new Error(`invalid page: ${page}`);
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
    throw new Error(`invalid limit: ${limit}`);
  }

  const sql = getPostgresClient();
  const offset = (page - 1) * limit;
  const rows = await sql.query(
    `SELECT * FROM messages ORDER BY ${sortedBy} ${order} LIMIT $1 OFFSET $2`,
    [limit, offset],
  );

  const messages = rows.map((row) => {
    return {
      message_obj_addr: row.message_obj_addr,
      creation_timestamp: parseInt(row.creation_timestamp),
      content: row.content,
      creator_addr: row.creator_addr,
      last_update_timestamp: parseInt(row.last_update_timestamp),
      last_update_event_idx: parseInt(row.last_update_event_idx),
    };
  });

  const rows2 = await sql`SELECT COUNT(*) FROM messages`;
  const count = rows2[0].count;

  return { messages, total: count };
};
