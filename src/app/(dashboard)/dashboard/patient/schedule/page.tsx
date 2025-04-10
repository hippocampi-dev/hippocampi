import { redirect } from "next/navigation";
import { getUserId } from "~/utilities/getUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getAllPatientDoctorManagement, getAppointments } from "~/server/db/queries";
import { CurrentAppointments } from "./CurrentAppointments";
import { DoctorAppointments } from "./DoctorAppointments";
import Loading from "~/components/loading/page";
import { Suspense } from "react";

export default function PatientSchedulePage() {
  return (
    <Suspense fallback={<Loading />}>
      <PatientScheduleContainer />
    </Suspense>
  );
}

async function PatientScheduleContainer() {
  const patientId1 = await getUserId();
  const patientId = patientId1 as "string";
  if (!patientId) {
    redirect("/");
  }
  
  // Get all the doctors for this patient
  
  const management = await getAllPatientDoctorManagement(patientId);
  const appointments = await getAppointments(patientId);
  
  return (
    <div className="container overflow-y-auto mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Appointment Management</h1>
      
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="schedule">Schedule Appointment</TabsTrigger>
          <TabsTrigger value="current">Current Appointments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="space-y-4">
          <DoctorAppointments patientId={patientId} doctorManagement={management} />
        </TabsContent>
        
        <TabsContent value="current">
          <CurrentAppointments appointments={appointments} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
