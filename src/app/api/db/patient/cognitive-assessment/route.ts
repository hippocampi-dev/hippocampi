import { auth } from "~/server/auth";
import { createAssessment } from "~/server/db/queries";
import { cognitiveAssessmentInterface } from "~/server/db/type";


export const POST = async (request: Request) => {
  console.log("accessed");
    try {
        const session = await auth();
        if (!session) {
          return new Response(JSON.stringify("no session"))
        }
        const body: cognitiveAssessmentInterface = await request.json();
        const { patientId, ...rest } = body;
        const response = await createAssessment({ patientId: session.user.id, ...rest });
        if (!response) {
            return new Response(JSON.stringify("no response"), {
              headers: { "Content-Type": "application/json" },
            });
          }
          return new Response(JSON.stringify(response), {
            headers: { "Content-Type": "application/json" },
          });
    } catch (error) {
        return new Response(JSON.stringify({error}), {status: 500})
    }
}