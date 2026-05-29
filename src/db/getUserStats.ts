import { getPostgresClient } from "@/lib/db";
import { UserStat } from "@/lib/type/user_stats";

export type GetUserStatsProps = {
  page: number;
  limit: number;
  sortedBy: "total_points";
  order: "ASC" | "DESC";
};

const ALLOWED_SORT_COLUMNS = new Set([
  "total_points",
  "s1_points",
  "created_messages",
  "updated_messages",
  "creation_timestamp",
  "last_update_timestamp",
]);
const ALLOWED_SORT_ORDERS = new Set(["ASC", "DESC"]);

export const getUserStats = async ({
  page,
  limit,
  sortedBy,
  order,
}: GetUserStatsProps): Promise<{
  userStats: UserStat[];
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
    `SELECT * FROM user_stats ORDER BY ${sortedBy} ${order} LIMIT $1 OFFSET $2`,
    [limit, offset],
  );

  const userStats = rows.map((row) => {
    return {
      user_addr: row.user_addr,
      creation_timestamp: parseInt(row.creation_timestamp),
      last_update_timestamp: parseInt(row.last_update_timestamp),
      created_messages: parseInt(row.created_messages),
      updated_messages: parseInt(row.updated_messages),
      s1_points: parseInt(row.s1_points),
      total_points: parseInt(row.total_points),
    };
  });

  const rows2 = await sql`SELECT COUNT(*) FROM user_stats`;
  const count = rows2[0].count;

  return { userStats, total: count };
};
