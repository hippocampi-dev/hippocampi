// type interface for db tables

import { doctors, patients, userRoles, users } from "./schema";

export type UsersInterface = typeof users.$inferInsert;

export type UsersRolesInterface = typeof userRoles.$inferInsert;

export type DoctorsInterface = typeof doctors.$inferInsert;

export type PatientsInterface = typeof patients.$inferInsert;