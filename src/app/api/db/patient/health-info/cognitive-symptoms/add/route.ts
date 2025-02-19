import { convertDateStringToDate } from "~/lib/utils";
import { addCognitiveSymptoms } from "~/server/db/queries";
import { PatientCognitiveSymptomsInterface } from "~/server/db/type";

// pass in PatientCognitiveSymptomsInteface json
export const POST = async (request: Request) => {
  try {
      const rawBody = await request.json();
      console.log("Raw cogniSymps data:", rawBody);
      const patientId = rawBody.patientId;
      // Iterate through each medication and convert date strings.
      const cognitiveSymptoms: PatientCognitiveSymptomsInterface = rawBody.cognitiveSymptoms.map((cog: any) => {
        const {onsetDate, ...rest } = cog;
        return {
          patientId,
          ...rest,
          onsetDate: cog.onsetDate ? convertDateStringToDate(cog.onsetDate) : null,
        }
      });
      const response = await addCognitiveSymptoms(cognitiveSymptoms);

    if (!response) {
      return new Response(JSON.stringify("Error"), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in medications API:", error);
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
};
