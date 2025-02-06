import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createTable, users } from "./auth";
import { timestamps } from "./util";

// Doctors (Types)
export const doctors = createTable(
  "doctors",
  {
    doctorId: varchar("doctorId", { length: 255 })
      .notNull()
      .primaryKey()
      .references(() => users.id, {onDelete: 'cascade'}),
    email: varchar("email", { length: 255 })
      .notNull()
      .references(() => users.email, {onDelete: 'cascade'}),
    location: text("location")
      .notNull(),
    branch: text("branch")
      .notNull(),
    specialty: varchar("specialty"),
    ...timestamps
  }
)