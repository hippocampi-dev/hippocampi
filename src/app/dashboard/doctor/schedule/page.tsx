import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { getDoctorAvailabilities, formatTimeWithAMPM } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";
import { AddAvailability } from "./AddAvailability";
import { DeleteAvailability } from "~/app/dashboard/doctor/schedule/DeleteAvailability";
import { X } from "lucide-react";

// Days of the week starting from Monday
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function Page() {
  const doctorId = await getUserId();
  if (!doctorId) {
    redirect("/");
  }
  
  const doctorAvailabilities = await getDoctorAvailabilities(doctorId);
  
  // Group availabilities by day of week
  const availabilitiesByDay = DAYS.reduce((acc, day) => {
    acc[day] = doctorAvailabilities.filter(
      availability => availability.dayOfWeek === day
    ).sort((a, b) => {
      // Sort by start time
      const aStart = a.startTime.split(':').map(Number);
      const bStart = b.startTime.split(':').map(Number);
      const aMinutes = (aStart[0] ?? 0) * 60 + (aStart[1] ?? 0);
      const bMinutes = (bStart[0] ?? 0) * 60 + (bStart[1] ?? 0);
      return aMinutes - bMinutes;
    });
    return acc;
  }, {} as Record<string, typeof doctorAvailabilities>);
  
  return (
    <div className="p-6 space-y-7">
      <div className="flex items-center justify-between space-x-4">
        <h1 className="text-2xl font-bold">Current Availabilities</h1>
        <AddAvailability/>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
        {DAYS.map((day) => (
          <div key={day} className="flex flex-col">
            <h3 className="mb-3 border-b pb-2 text-center font-medium">
              {day}
            </h3>
            <div className="flex flex-col gap-2 rounded-lg">
              {(availabilitiesByDay[day] || []).length > 0 ? (
                (availabilitiesByDay[day] ?? []).map((availability) => (
                  <div
                    key={availability.recurringId}
                    className="relative rounded-md border border-primary/20 bg-primary/10 p-3"
                  >
                    <DeleteAvailability
                      availabilityId={availability.recurringId}
                      className="absolute right-1 top-1 h-6 w-6"
                    />
                    <p className="text-sm font-medium">
                      {formatTimeWithAMPM(availability.startTime)} - {formatTimeWithAMPM(availability.endTime)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm italic text-muted-foreground p-2">
                  No availability
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
