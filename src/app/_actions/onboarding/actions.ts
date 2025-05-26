'use server'

import { CredentialsInterface } from "~/app/(dashboard)/onboarding/credentials/page";
import { addDoctor, addDoctorCredentials, addDoctorSubscription, getDoctor, setDoctor, setDoctorCredentialLinks } from "~/server/db/queries"
import { DoctorCredentialsInterface, DoctorsInterface, SubscriptionsInterface } from "~/server/db/type";
import { uploadCredentialsFile } from "../upload/actions";
import { isTesting } from "~/env";

export async function updateDoctorOnboardingStatus(
  status: 'not-started' | 'profile' | 'credentials' | 'pending' | 'approved' | 'rejected',
  doctorId: string
) {
  const doctor = await getDoctor(doctorId as "string");
  const modifiedDoctor: DoctorsInterface = {
    ...doctor!,
    onboardingStatus: status
  }
  return await setDoctor(doctorId as "string", modifiedDoctor);
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
  // process files into json
  const processedCredentials = await convertCredentialFilesToUrl(id, credentials);

  // update db
  const returnedCredentials = await setDoctorCredentialLinks(id as "string", processedCredentials);

  if (returnedCredentials) {
    // update doctor onboarding status
    await updateDoctorOnboardingStatus(isTesting() ? 'approved' : 'pending', id);
  }

  return returnedCredentials;
}

async function convertCredentialFilesToUrl(id: string, credentials: CredentialsInterface) {
  const processedCredentials = {
    npi: {
      ...credentials.npi,
      file: typeof credentials.npi.file !== 'string' ? credentials.npi.file!.name : '',
      fileUrl: (await uploadCredentialsFile(id, 'npi-document', credentials.npi.file as File))
    },
    license: {
      ...credentials.license,
      file: typeof credentials.license.file !== 'string' ? credentials.license.file!.name : '',
      fileUrl: (await uploadCredentialsFile(id, 'medical-license', credentials.license.file as File))
    },
    dea: {
      ...credentials.dea,
      file: typeof credentials.dea.file !== 'string' ? credentials.dea.file!.name : '',
      fileUrl: (await uploadCredentialsFile(id, 'dea-certificate', credentials.dea.file as File))
    },
    malpractice: {
      ...credentials.malpractice,
      file: typeof credentials.malpractice.file !== 'string' ? credentials.malpractice.file!.name : '',
      fileUrl: (await uploadCredentialsFile(id, 'malpractice-policy', credentials.malpractice.file as File))
    },
    certifications: {
      certifications: await Promise.all(credentials.certifications.certifications.map(async (cert) => ({
        ...cert,
        file: typeof cert.file !== 'string' ? cert.file!.name : '',
        fileUrl: (await uploadCredentialsFile(id, 'certification', cert.file as File, cert.id))
      })))
    }
  }

  return processedCredentials
}