import { pgTable, bigint, text, jsonb, timestamp, customType } from "drizzle-orm/pg-core";

const vector = customType<{ data: number[]; driverData: string }>({
  dataType: () => "vector(1536)",
  toDriver: (v) => JSON.stringify(v),
});

export const chunks = pgTable("chunks", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  content: text("content").notNull(),
  metadata: jsonb("metadata")
    .$type<{ projectId?: string; title?: string; section?: string }>()
    .notNull()
    .default({}),
  embedding: vector("embedding"),
  createdAt: timestamp("created_at").defaultNow(),
});
