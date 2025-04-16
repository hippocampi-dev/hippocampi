import { CredentialsInterface } from "~/app/(dashboard)/onboarding/credentials/page";
import { getUrl } from "~/app/_actions/upload/actions";
import DoctorApprovalPage from "~/components/admin-dashboard/DoctorApprovalPage";
import { getPendingDoctorCredentials } from "~/server/db/queries";

interface props {
  params: Promise<{ id: string }>;
}

export default async function DoctorDetailsPage({ params }: props) {
  const { id } = await params;
  let dict = await getPendingDoctorCredentials();
  const data = dict[id]?.credentials.files as CredentialsInterface

  // get signed urls from supabase. previously, urls were only the paths to files in supabase storage
  dict[id] = {
    ...dict[id]!,
    credentials: {
      ...dict[id]!.credentials!,
      files: {
        npi: {
          ...data.npi,
          fileUrl: (await getUrl(data.npi.fileUrl!))
        },
        license: {
          ...data.license,
          fileUrl: (await getUrl(data.license.fileUrl!))
        },
        dea: {
          ...data.dea,
          fileUrl: (await getUrl(data.dea.fileUrl!))
        },
        malpractice: {
          ...data.malpractice,
          fileUrl: (await getUrl(data.malpractice.fileUrl!))
        },
        certifications: {
          certifications: await Promise.all(data.certifications.certifications.map(async (cert) => ({
            ...cert,
            fileUrl: (await getUrl(cert.fileUrl!))
          })))
        }
      }
    }
  }

  return (
    <DoctorApprovalPage id={id} dict={dict} data={data} />
  )
}