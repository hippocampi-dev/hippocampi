import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema_auth from './schema/auth';
import * as schema_doctor from './schema/doctor';
import * as schema_management from './schema/management';
import * as schema_patient from './schema/patient';
import * as schema_messages from './schema/message';

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

export const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

const schema = { ...schema_auth, ...schema_doctor, ...schema_management, ...schema_patient, ...schema_messages}

export const db = drizzle(conn, { schema:  schema});