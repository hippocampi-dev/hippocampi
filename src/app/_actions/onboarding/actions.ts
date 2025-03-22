'use server'

import { CredentialsInterface } from "~/app/(dashboard)/onboarding/credentials/page";
import { auth } from "~/server/auth"
import { addDoctor, addDoctorCredentials, addDoctorSubscription, getDoctor, setDoctor, setDoctorCredentialLinks } from "~/server/db/queries"
import { DoctorCredentialsInterface, DoctorsInterface, SubscriptionsInterface } from "~/server/db/type";
import { uploadCredentialsFile } from "../blob/actions";
import { createTestCredentials } from "./test-data";

export async function updateDoctorOnboardingStatus(status: 
  'not-started' |
  'profile' |
  'credentials' |
  'pending' |
  'approved' | 'rejected') {
  const session = await auth();
  const doctor = await getDoctor(session?.user.id as "string");
  const modifiedDoctor: DoctorsInterface = {
    ...doctor!,
    onboardingStatus: status
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
  // credentials = createTestCredentials();

  const processedCredentials = await convertCredentialFilesToBlobUrl(id, credentials);
  // console.log('credentials', processedCredentials);
  // console.log('certifications', processedCredentials.certifications.certifications)

  const returnedCredentials = await setDoctorCredentialLinks(id as "string", processedCredentials);

  if (returnedCredentials) {
    await updateDoctorOnboardingStatus('pending');
  }

  return returnedCredentials;
}

async function convertCredentialFilesToBlobUrl(id: string, credentials: CredentialsInterface) {
  const processedCredentials = {
    npi: {
      ...credentials.npi,
      file: typeof credentials.npi.file !== 'string' ? credentials.npi.file!.name : '',
      fileUrl: (await uploadCredentialsFile(id, 'npi-document', credentials.npi.file as File)).url
    },
    license: {
      ...credentials.license,
      file: typeof credentials.license.file !== 'string' ? credentials.license.file!.name : '',
      fileUrl: (await uploadCredentialsFile(id, 'medical-license', credentials.license.file as File)).url
    },
    dea: {
      ...credentials.dea,
      file: typeof credentials.dea.file !== 'string' ? credentials.dea.file!.name : '',
      fileUrl: (await uploadCredentialsFile(id, 'dea-certificate', credentials.dea.file as File)).url
    },
    malpractice: {
      ...credentials.malpractice,
      file: typeof credentials.malpractice.file !== 'string' ? credentials.malpractice.file!.name : '',
      fileUrl: (await uploadCredentialsFile(id, 'malpractice-policy', credentials.malpractice.file as File)).url
    },
    certifications: {
      certifications: await Promise.all(credentials.certifications.certifications.map(async (cert) => ({
        ...cert,
        file: typeof cert.file !== 'string' ? cert.file!.name : '',
        fileUrl: (await uploadCredentialsFile(id, 'certification', cert.file as File, cert.id)).url
      })))
    }
  }

  return processedCredentials
}