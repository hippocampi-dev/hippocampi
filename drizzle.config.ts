import { defineConfig } from "drizzle-kit";

import { env, getDatabaseUrl } from "~/env";

export default defineConfig({
  schema: [
    "./src/server/db/schema/schema.ts",
    "./src/server/db/schema/auth.ts",
    "./src/server/db/schema/doctor.ts",
    "./src/server/db/schema/management.ts",
    "./src/server/db/schema/patient.ts",
    "./src/server/db/schema/message.ts",
    "./src/server/db/schema/relations.ts",
    "./src/server/db/schema/cms.ts"
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: getDatabaseUrl(),
    ssl: 'require'
  },
  tablesFilter: ["hippocampi_*"],
  // Add verbose mode to help troubleshoot issues
  verbose: true,
  // Add strict mode to avoid undefined CHECK constraints issues
  strict: true,
})