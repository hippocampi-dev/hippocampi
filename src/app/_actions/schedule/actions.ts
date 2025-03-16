"use server"
import { z, ZodType } from "zod"
import { revalidatePath } from "next/cache";
import { addDoctorAvailabilities, checkOverlappingAvailability, updateAppointmentStatus } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";
import { redirect } from "next/navigation";
import { availabilitySchema } from "~/lib/utils";
import { DoctorAvailabilitiesInterface } from "~/server/db/type";
import { getDoctor, getDoctorAvailabilities } from "~/server/db/queries";
import { DoctorsInterface } from "~/server/db/type";
import { addDays, format } from "date-fns";

export async function fetchDoctorDetails(doctorId: "string"): Promise<DoctorsInterface> {
  const doctor = await getDoctor(doctorId);
  
  if (!doctor) {
    throw new Error("Doctor not found");
  }
  
  return doctor;
}

export async function fetchAvailabilities(doctorId: string) {
  // Get all availabilities for the doctor
  const availabilities = await getDoctorAvailabilities(doctorId);
  
  // Get the next 14 days
  const today = new Date();
  const nextTwoWeeks = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(today, i);
    return {
      date,
      dayOfWeek: format(date, 'EEEE') as "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
      formattedDate: format(date, 'MMM dd, yyyy'),
    };
  });
  
  // Map availabilities to actual calendar dates for the next 2 weeks
  const availableTimes = nextTwoWeeks.flatMap(day => {
    const dayAvailabilities = availabilities.filter(a => a.dayOfWeek === day.dayOfWeek);
    
    return dayAvailabilities.map(avail => ({
      date: day.date,
      formattedDate: day.formattedDate,
      dayOfWeek: day.dayOfWeek,
      startTime: avail.startTime,
      endTime: avail.endTime,
      availabilityId: avail.recurringId,
    }));
  });
  
  return availableTimes;
}

export async function scheduleAppointment(data: {
  doctorId: string;
  patientId: string;
  scheduledAt: Date;
  reason: string;
  notes?: string;
}) {
  try {
    const response = await fetch(`/api/db/management/appointments/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Failed to schedule appointment:", error);
    throw new Error("Failed to schedule appointment");
  }
}

export async function createAvailability(formData: FormData) {
  // Extract form data
  const rawData = {
    day: formData.get("day"),
    "start-time": formData.get("start-time"),
    "end-time": formData.get("end-time"),
  }
  
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
  
  try {
    const doctorId = await getUserId();
    if (!doctorId) {
      redirect("/")
    }
    
    // Check for overlapping availabilities
    const overlap = await checkOverlappingAvailability(
      doctorId,
      validData.day,
      validData["start-time"],
      validData["end-time"]
    );
    
    if (overlap) {
      return {
        errors: {
          "time": [`Overlaps with existing availability at ${overlap.existingTime}`]
        },
        error: `Overlaps with existing availability at ${overlap.existingTime}`,
        message: "Validation failed",
      }
    }
    
    const body: DoctorAvailabilitiesInterface = {
      doctorId: doctorId, 
      dayOfWeek: validData.day as "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
      startTime: validData["start-time"],
      endTime: validData["end-time"],
    }
    
    // Call your database function with the validated data
    await addDoctorAvailabilities(body)

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

export async function updateAppointment(appointmentId: string, status: "Scheduled" | "Completed" | "Canceled" | "No-Show") {
  try {
    const updatedAppointment = await updateAppointmentStatus(appointmentId, status);
    
    if (!updatedAppointment || updatedAppointment.length === 0) {
      throw new Error("Failed to update appointment status");
    }
    
    // Revalidate relevant paths
    revalidatePath("/dashboard/patient/schedule");
    revalidatePath("/dashboard/doctor/appointments");
    
    return { success: true, appointment: updatedAppointment[0] };
  } catch (error) {
    console.error("Failed to update appointment status:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

