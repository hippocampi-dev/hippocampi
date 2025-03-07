import { NextResponse } from "next/server";
import { getDoctor } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";

export const POST = async (request: Request) => {
  try {
    const doctorId = await request.json()
    const passedDoctorId = doctorId.doctorId as "string"
    console.log(doctorId.doctorId);
    if (doctorId) {
      const response = await getDoctor(passedDoctorId);
      console.log("response is " + response)
      return new Response(JSON.stringify(response), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return undefined;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
};