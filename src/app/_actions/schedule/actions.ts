"use server"
import { z, ZodType } from "zod"
import { revalidatePath } from "next/cache";
import { addDoctorAvailabilities } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";
import { redirect } from "next/navigation";
import { availabilitySchema } from "~/lib/utils";
import { DoctorAvailabilitiesInterface } from "~/server/db/type";

export async function createAvailability(formData: FormData) {
  // Extract form data
  const rawData = {
    day: formData.get("day"),
    "start-time": formData.get("start-time"),
    "end-time": formData.get("end-time"),
  }
  console.log("Raw data: " + JSON.stringify(rawData));
  // Validate the form data
  const validationResult = availabilitySchema.safeParse(rawData)
  
  if (!validationResult.success) {
    // Return validation errors
    return {
      errors: validationResult.error.flatten().fieldErrors,
      message: "Validation failed",
    }
  }

  // If validation passes, proceed with the data
  const validData = validationResult.data
  console.log("Valid Data: " + JSON.stringify(validData))
  try {
    const doctorId = await getUserId();
    if (!doctorId) {
      redirect("/")
    }
    const body: DoctorAvailabilitiesInterface = {doctorId: doctorId, dayOfWeek: validData.day as "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
      startTime: validData["start-time"],
      endTime: validData["end-time"],}
    // Call your database function with the validated data
    await addDoctorAvailabilities(
      body
    )

    // Revalidate the path to refresh the data
    revalidatePath("/dashboard/doctor/schedule")

    // Return success
    return { message: "Availability added successfully" }
  } catch (error) {
    // Handle any errors
    return {
      message: "Failed to add availability",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

