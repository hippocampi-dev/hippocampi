'use server'

import { getDoctor, getDoctorSubscription, getPatient, getPatientHealthInformation } from "~/server/db/queries";

export async function getPatientDetails(patientId: string) {
  const patient = await getPatient(patientId as "string");
  return patient;
  
}

export async function getPatientHealthInfo(patientId: string) {
  const healthInfo = await getPatientHealthInformation(patientId as "string");
  return healthInfo;
}


export async function getDoctorDetails(doctorId: string) {
  const doctor = await getDoctor(doctorId as "string");
  return doctor;
}

export async function getDoctorSubscriptionDetails(doctorId: string) {
  const subscription = await getDoctorSubscription(doctorId as "string");
  return subscription;
}