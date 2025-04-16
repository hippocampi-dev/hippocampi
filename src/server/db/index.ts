import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env, getDatabaseUrl } from "~/env";
import * as schema_auth from './schema/auth';
import * as schema_doctor from './schema/doctor';
import * as schema_management from './schema/management';
import * as schema_patient from './schema/patient';
import * as schema_message from './schema/message';

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// Get the appropriate database URL based on the environment
const connectionString = getDatabaseUrl();

// Create or reuse the database connection
export const conn = globalForDb.conn ?? postgres(connectionString,
  // Connection Options
  {
    prepare: false,
    ssl: {
      rejectUnauthorized: true
    },
    // Adjust connection pool settings based on environment
    max: env.NODE_ENV === "production" ? 3 : 1,
    idle_timeout: env.NODE_ENV === "production" ? 30 : 10,
  }
);

// Cache the connection in development
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

// Combine all schema objects
const schema = { 
  ...schema_auth, 
  ...schema_doctor, 
  ...schema_management, 
  ...schema_patient, 
  ...schema_message 
};

// Create and export the Drizzle ORM instance
export const db = drizzle(conn, { schema: schema });