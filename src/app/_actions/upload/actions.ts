'use server'

import { uploadAppointmentNotesUrl } from '~/server/db/queries';
import { supabase } from '~/utilities/supabase';

// ~ signify dynamic routes

// doctors/~doctorId/credentials/~credentialsType/~files
export async function uploadCredentialsFile(
  doctorId: string, 
  credentialType: 'npi-document' | 'medical-license' | 'dea-certificate' | 'malpractice-policy' | 'certification',
  file: File,
  certId?: string
) {
  return uploadFile('doctor-credentials', `${doctorId}/credentials/${credentialType}/${credentialType === 'certification' && certId ? `${certId}/` : ''}${file.name}`, file)
}

// doctors/~doctorId/patients/~patientId/appointments/~appointmentId/~notes.pdf
// export async function uploadAppointmentNotesFile(
//   doctorId: string,
//   patientId: string,
//   appointmentId: string,
//   file: File,
// ) {
//   const blob = await put(`doctors/${doctorId}/patients/${patientId}/appointments/${appointmentId}/${file.name}`, file, {
//     access: 'public',
//     addRandomSuffix: false
//   });

//   const response = await uploadAppointmentNotesUrl(appointmentId, blob.url);

//   return blob; // assume const blob = await uploadAppointmentNotesFile(params), call blob.url to get url to blob db
// }

async function uploadFile(
  bucketName: string,
  path: string,
  file: File
) {
  // note to self, BUCKET NAME = doctor-credentials & doctors
  const { data, error } = await supabase.storage.from(bucketName).upload(path, file);

  if (error) {
    throw new Error(error.message)
  }

  return data.path // return path, doesn't include bucket
}

export async function getUrl(
  path: string
) {
  const { data, error } = await supabase
    .storage
    .from('doctor-credentials')
    .createSignedUrl(path, 60 * 60) // 1 hour
  
  if (error) {
    throw new Error(error.message)
  }

  return data?.signedUrl // return url to file for images and pdfs
}