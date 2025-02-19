import { UserRolesInterface } from "~/server/db/type";


async function fetchUserRole(): Promise<UserRolesInterface | null> {
    try {
      const res = await fetch("/api/db/management/user-role/has");
      const data = (await res.json()) as UserRolesInterface;
      return data;
    } catch (err) {
      console.error("Error fetching user role:", err);
      return null;
    }
  }