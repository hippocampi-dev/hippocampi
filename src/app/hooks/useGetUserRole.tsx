interface UserRoleResponse {
  response: boolean;
}

async function fetchUserRole(): Promise<UserRoleResponse | null> {
    try {
      const res = await fetch("/api/db/management/user-role/has");
      const data = (await res.json()) as UserRoleResponse;
      return data;
    } catch (err) {
      console.error("Error fetching user role:", err);
      return null;
    }
  }