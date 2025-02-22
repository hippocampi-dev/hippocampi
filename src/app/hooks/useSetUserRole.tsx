// useSetUserRole.ts
"use client";

import { useSession } from "next-auth/react";
import { role, UserRolesInterface } from "~/server/db/type";

export default function useSetUserRole() {
  const { data: session } = useSession();

  const setUserRole = async (userRole: role) => {
    console.log(session);
    if (!session) {
      console.error("Session is null");
      return;
    }

    const params: UserRolesInterface = {
      userId: session.user.id,
      userRole: userRole
    };

    try {
      const response = await fetch("/api/db/management/user-role/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return setUserRole;
}
