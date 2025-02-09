import { addUserRole } from "~/server/db/queries";
import { UserRolesInterface } from "~/server/db/type";

// pass in UserRoleInterface json
export const POST = async (request: Request) => {
  const body: UserRolesInterface = await request.json();

  try {
    const response = await addUserRole(body);

    if (!response) {
      return Response.json("Error");
    }

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
};
