import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { getDoctorAvailabilities } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";

export default async function Page() {
  const doctorId = await getUserId();
  if (!doctorId) {
    redirect("/");
  }
  const doctorAvailabilities = await getDoctorAvailabilities(doctorId);
  return (
    <div className="p-6">
      <div className="flex items-center justify-between space-x-4">
        <h1 className="text-2xl font-bold">Current Availabilities</h1>
        <Button>Add availability</Button>
      </div>

      <div className="flex justify-center">
        {JSON.stringify(doctorAvailabilities)}
      </div>
    </div>
  );
}
