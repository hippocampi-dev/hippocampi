import { defineConfig } from "drizzle-kit";

import { env } from "~/env";

export default defineConfig({
  schema: [
    "./src/server/db/schema/schema.ts",
    "./src/server/db/schema/auth.ts",
    "./src/server/db/schema/doctor.ts",
    "./src/server/db/schema/management.ts",
    "./src/server/db/schema/patient.ts",
    "./src/server/db/schema/message.ts",
    "./src/server/db/schema/relations.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["hippocampi_*"],
})