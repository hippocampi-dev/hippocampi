'use server'

import { put } from '@vercel/blob';

export async function uploadFile(
  doctorId: string, 
  credentialType: 'npi-document' | 'medical-license' | 'dea-certificate' | 'malpractice-policy' | 'certification',
  file: File,
  certId?: string
) {
  const blob = await put(`${doctorId}/${credentialType}/${credentialType === 'certification' && certId ? `${certId}/` : ''}${file.name}`, file, {
    access: 'public',
    addRandomSuffix: false
  });

  return blob;
}