import { timestamp } from "drizzle-orm/pg-core"

// Helper function for timestamps
export const timestamps = {
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}