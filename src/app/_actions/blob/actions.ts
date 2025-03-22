'use server'

import { put } from '@vercel/blob';
import { uploadAppointmentNotesUrl } from '~/server/db/queries';

// ~ signify dynamic routes

// doctors/~doctorId/credentials/~credentialsType/~files
export async function uploadCredentialsFile(
  doctorId: string, 
  credentialType: 'npi-document' | 'medical-license' | 'dea-certificate' | 'malpractice-policy' | 'certification',
  file: File,
  certId?: string
) {
  const blob = await put(`doctors/${doctorId}/credentials/${credentialType}/${credentialType === 'certification' && certId ? `${certId}/` : ''}${file.name}`, file, {
    access: 'public',
    addRandomSuffix: false
  });

  return blob;
}

// doctors/~doctorId/patients/~patientId/appointments/~appointmentId/~notes.pdf
export async function uploadAppointmentNotesFile(
  doctorId: string,
  patientId: string,
  appointmentId: string,
  file: File,
) {
  const blob = await put(`doctors/${doctorId}/patients/${patientId}/appointments/${appointmentId}/${file.name}`, file, {
    access: 'public',
    addRandomSuffix: false
  });

  const response = await uploadAppointmentNotesUrl(appointmentId, blob.url);

  return blob; // assume const blob = await uploadAppointmentNotesFile(params), call blob.url to get url to blob db
}