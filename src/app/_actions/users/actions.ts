'use server'

import { getDoctor, getMedicalHistory, getPatient } from "~/server/db/queries";

export async function getPatientDetails(patientId: string) {
  const patient = await getPatient(patientId as "string");
  return patient;
  
}

export async function getPatientMedicalHistory(patientId: string) {
  const medicalHistory = await getMedicalHistory(patientId as "string");
  return medicalHistory;
}


export async function getDoctorDetails(doctorId: string) {
  const doctor = await getDoctor(doctorId as "string");
  return doctor;
}