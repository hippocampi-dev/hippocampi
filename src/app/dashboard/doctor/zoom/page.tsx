import CreateMeeting from "~/components/meeting/CreateMeeting";
import { getPatientDict, getPatients } from "~/server/db/queries";
import { getUserId } from "~/utilities/get-user";

export default async function CreateMeetingPage() {
  const doctorId = await getUserId() as "string";
  const patients = await getPatients(doctorId);
  const patientDict = await getPatientDict(doctorId);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Create Zoom Meeting</h1>
      <CreateMeeting
        patients={patients}
        patientDict={patientDict}
      />
    </main>
  )
}
