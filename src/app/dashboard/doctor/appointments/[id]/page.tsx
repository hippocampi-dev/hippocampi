import CreateMeeting from "~/components/meeting/create/page";

interface props {
  params: Promise<{ id: string }>;
}

export default async function CreateMeetingPage({ params }: props) {
  const { id } = await params;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Create Zoom Meeting</h1>
      <CreateMeeting />
    </main>
  )
}
