import { Loader2 } from "lucide-react";
import { generateObject, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  getAllDoctors,
  getAssessment,
  getDoctorSubscription,
} from "~/server/db/queries";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

export default async function LoadingPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  const userId = session.user.id as "string";
  interface Assessment {
    primaryConcerns: string[];
    additionalSupport: string[];
    mentalDemands: string;
    cognitiveChanges: string;
    areasForHelp: string[];
    additionalInfo: string;
  }

  const assessment = (await getAssessment(userId)) as Assessment;
  console.log(JSON.stringify(assessment));
  const doctors = await getAllDoctors();
  console.log(JSON.stringify(doctors));
  const prompt = `
  Cognitive Assessment Results:

Primary Concerns: ${assessment.primaryConcerns.join(", ")}
Additional Support Areas: ${assessment.additionalSupport.join(", ")}
Mental Demands: ${assessment.mentalDemands}
Cognitive Changes: ${assessment.cognitiveChanges}
Areas for Help: ${assessment.areasForHelp.join(", ")}
Additional Information: ${assessment.additionalInfo}

The full list of available doctors is provided below as a JSON array. Each doctor object includes the following fields: doctorId, firstName, lastName, specialization, and other relevant information.

Available Doctors:
${JSON.stringify(doctors, null, 2)}

Based on this cognitive assessment and the list of available doctors, please do the following:
Identify the 4 best doctors suited for this patient (if there are less, identify that many), and return each of their id's with the best doctor returned first. For the first doctor only, provide a brief, personalized explanation of why they are recommended. This explanation should be in 2nd person, talking kindly and compassionately to the patient.

Please ensure that the returned doctor IDs match exactly what is provided in the JSON array.
    `;
  console.log(prompt);

  const result = await generateObject({
    model: openai("gpt-4o", {
      structuredOutputs: true,
    }),
    schemaName: "doctorSelection",
    schemaDescription:
      "A list of 4 doctor Id's and a brief, personalized explanation for the best doctor of the bunch",
    schema: z.object({
      recommendations: z
        .string()
        .describe(
          "A brief explanation of why the best doctor matches the patient",
        ),
      selectedDoctors: z
        .array(
          z.object({
            doctorId: z
              .string()
              .describe("The exact unique identifier of the doctor."),
          }),
        )
        .describe("The list of 4 recommended doctors."),
    }),
    prompt: prompt,
  });
  localStorage.setItem("Doctors and Explanation", JSON.stringify(result))
  redirect("/dashboard/patient/cognitive-assessment/results")
}