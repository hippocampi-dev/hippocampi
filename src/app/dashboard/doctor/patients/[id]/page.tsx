import PatientDetails from "./patient"

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <PatientDetails id={id} />
  )
}

