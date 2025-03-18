import JoinMeeting from "~/components/meeting/JoinMeeting"

export default function JoinMeetingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Join Zoom Meeting</h1>
      <JoinMeeting />
    </main>
  )
}

