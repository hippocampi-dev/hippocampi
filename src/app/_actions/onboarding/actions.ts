'use server'

import { CredentialsInterface } from "~/app/(dashboard)/onboarding/credentials/page";
import { auth } from "~/server/auth"
import { addDoctor, addDoctorCredentials, addDoctorSubscription, getDoctor, setDoctor, setDoctorCredentialLinks } from "~/server/db/queries"
import { DoctorCredentialsInterface, DoctorsInterface, SubscriptionsInterface } from "~/server/db/type";

export async function updateDoctorOnboardingStatus() {
  const session = await auth();
  const doctor = await getDoctor(session?.user.id as "string");
  const modifiedDoctor: DoctorsInterface = {
    ...doctor!,
    onboardingStatus: 'pending-approval'
  }
  return await setDoctor(session?.user.id as "string", modifiedDoctor);
}

export async function addDoctorOnboarding(doctor: DoctorsInterface) {
  return await addDoctor(doctor);
}
export async function addDoctorCredentialsOnboarding(credentials: DoctorCredentialsInterface) {
  return await addDoctorCredentials(credentials);
}
export async function addDoctorSubscriptionOnboarding(subscription: SubscriptionsInterface) {
  return await addDoctorSubscription(subscription);
}

export async function addDoctorCredentialLinksOnboarding(id: string, credentials: CredentialsInterface) {
  // console.log(credentials);
  return;
  return await setDoctorCredentialLinks(id as "string", credentials);
}

// Doctor Onboarding Credentials Repository --> YYYY --> DoctorID --> Files
// Doctor Onboarding Credentials Repository/2025/doctorId/DEAForm.pdf

// export interface CredentialsInterface {
//   npi: NPIForm,
//   license: LicenseForm,
//   dea: DEAForm,
//   malpractice: MalpracticeForm,
//   certifications: CertificationsForm
// }
// export interface NPIForm {
//   npiNumber: string
//   file: File
// }
// export interface LicenseForm {
//   licenseNumber: string,
//   expirationDate: string,
//   file: File
// }
// export interface DEAForm {
//   deaNumber: string
//   startDate: string
//   expirationDate: string
//   file: File
// }
// export interface MalpracticeForm {
//   policyNumber: string
//   insurerName: string
//   startDate: string
//   expirationDate: string
//   coverageAmount: string
//   file: File
// }export interface Certification {
//   id: string
//   organization: string
//   name: string
//   dateReceived: string
//   expirationDate?: string
//   file: File
// }
// export interface CertificationsForm {
//   certifications: Certification[]
// }