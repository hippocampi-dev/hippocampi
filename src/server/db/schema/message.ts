// schema/message.ts
import { createTable } from "./schema";
import { varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { users } from "./auth"; // Assuming your users table is defined here
import { patients } from "./patient";
import { doctors } from "./doctor";
import { timestamps } from "./utils";

export const conversations = createTable('conversations', {
    conversationId: varchar("conversation_id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    patientId: varchar("patient_id", { length: 255 })
      .notNull()
      .references(() => patients.patientId, { onDelete: 'cascade' }),
    doctorId: varchar("doctor_id", { length: 255 })
      .notNull()
      .references(() => doctors.doctorId, { onDelete: 'cascade' }),
    subject: varchar("subject", { length: 255 }),
    status: varchar("status", { length: 50 }).default("open"),
    ...timestamps,
  });

  export const messages = createTable('messages', {
    messageId: varchar("message_id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    conversationId: varchar("conversation_id", { length: 255 })
      .notNull()
      .references(() => conversations.conversationId, { onDelete: 'cascade' }),
    senderId: varchar("sender_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    content: text("content").notNull(),
    read: boolean("read").notNull(),
    ...timestamps,
  });
  
  