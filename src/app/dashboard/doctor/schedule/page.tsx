import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { getDoctorAvailabilities } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";
import { AddAvailability } from "./AddAvailability";


// Days of the week starting from Monday
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


export default async function Page() {
  const doctorId = await getUserId();
  if (!doctorId) {
    redirect("/");
  }
  const doctorAvailabilities = await getDoctorAvailabilities(doctorId);
  return (
    <div className="p-6 space-y-7">
      <div className="flex items-center justify-between space-x-4">
        <h1 className="text-2xl font-bold">Current Availabilities</h1>
        <AddAvailability/>
      </div>
      <div className = "grid grid-cols-1 gap-4 md:grid-cols-7">
        {DAYS.map((day) => (
            <div key = {day} className = "flex flex-col">
                <h3 className="mb-3 border-b pb-2 text-center font-medium">
                    {day}
                </h3>
                <div className="flex flex-col gap-2 border-l-2 border-r-2">
                </div>
            </div>
        ))}
      </div>
      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
        {DAYS.map((day) => (
          <div key={day} className="flex flex-col">
            <h3 className="mb-3 border-b pb-2 text-center font-medium">
              {day}
            </h3>
            <div className="flex flex-col gap-2">
              {getSortedSlots(day).length > 0 ? (
                getSortedSlots(day).map((slot) => (
                  <div
                    key={slot.id}
                    className="relative rounded-md border border-primary/20 bg-primary/10 p-3"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-6 w-6"
                      onClick={() => removeAvailabilitySlot(slot.id)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                    <p className="text-sm font-medium">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm italic text-muted-foreground">
                  No availability
                </p>
              )}
            </div>
          </div>
        ))}
      </div> */}
      {/* <WeeklyAvailabilityChart /> */}
    </div>
  );
}
