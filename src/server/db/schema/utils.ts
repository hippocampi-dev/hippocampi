import { timestamp } from "drizzle-orm/pg-core"

// Helper function for timestamps
export const timestamps = {
  created_at: timestamp("created_at", { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { mode: 'string' })
    .defaultNow()
    .$onUpdate(() => new Date().toString())
    .notNull(),
}