// app/meeting/[appointmentId]/page.tsx
import { client } from '~/utilities/stream';
import MeetingClient from './meeting-client';
import { generateStreamUserInfo } from '~/app/_actions/stream/actions';

export default async function MeetingPage({ 
  params 
}: { 
  params: { appointmentId: string } 
}) {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
  const {appointmentId} = await params;
  
  // Server-side call creation
  const call = client.video.call("default", appointmentId);
  const { token, user } = await generateStreamUserInfo();
  await call.create({
    data: {
      created_by_id: user?.id,
    }
  });

  // Get user token

  return <MeetingClient callId={appointmentId} apiKey={apiKey} token={token} user={user} />;
}