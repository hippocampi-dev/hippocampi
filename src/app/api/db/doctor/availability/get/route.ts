import { NextResponse } from "next/server";
import { addDays, format } from "date-fns";
import { getDoctorAvailabilities } from "~/server/db/queries";

export const GET = async (request: Request) => {
  try {
    // Get the doctor id from the URL query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Doctor ID is required" },
        { status: 400 }
      );
    }
    
    // Get all availabilities for the doctor
    const availabilities = await getDoctorAvailabilities(id);
    
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
    
    return NextResponse.json({ availabilities: availableTimes });
  } catch (error) {
    console.error("Error fetching doctor availabilities:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};
