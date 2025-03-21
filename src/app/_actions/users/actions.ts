import { getDoctor, getPatient } from "~/server/db/queries";

export async function getPatientDetails(patientId: string) {
  const patient = await getPatient(patientId as "string");
  return patient;
}

export async function getDoctorDetails(doctorId: string) {
  const doctor = await getDoctor(doctorId as "string");
  return doctor;
}