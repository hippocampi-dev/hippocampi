import { addPatientDoctorManagement } from "~/server/db/queries";
import { PatientDoctorManagementInterface } from "~/server/db/type";

// pass in PatientDoctorManagementInterface json
export const POST = async (request: Request) => {
  const body: PatientDoctorManagementInterface = await request.json();
  console.log(body)
  try {
    const response = await addPatientDoctorManagement(body);

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