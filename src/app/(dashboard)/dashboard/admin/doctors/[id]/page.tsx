import { CredentialsInterface } from "~/app/(dashboard)/onboarding/credentials/page";
import DoctorApprovalPage from "~/components/admin-dashboard/DoctorApprovalPage";
import { getPendingDoctorCredentials } from "~/server/db/queries";

interface props {
  params: Promise<{ id: string }>;
}

export default async function DoctorDetailsPage({ params }: props) {
  const { id } = await params;
  const dict = await getPendingDoctorCredentials();
  const data = dict[id]?.credentials.files as CredentialsInterface

  return (
    <DoctorApprovalPage id={id} dict={dict} data={data} />
  )
}