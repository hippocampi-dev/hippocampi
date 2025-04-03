// app/meeting/[appointmentId]/meeting-client.tsx
'use client';

import { useEffect, useState } from 'react';
import { StreamVideo, StreamVideoClient, StreamCall, User, useCall, useCallStateHooks, CallingState, StreamTheme, ParticipantView, StreamVideoParticipant, SpeakerLayout, CallControls } from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';


interface MeetingClientProps {
  callId: string;
  apiKey: string;
  token: string;
  user: User
}

export default function MeetingClient({ callId, apiKey, token, user }: MeetingClientProps) {
  const [callInstance, setCallInstance] = useState<ReturnType<StreamVideoClient['call']> | null>(null);
  const [isJoining, setIsJoining] = useState(true);

  if (!user.id || !user.name) {
    throw new Error("User ID and name must be defined");
  }

  const client = StreamVideoClient.getOrCreateInstance({ 
    apiKey, 
    token,
    user: {
      id: user.id,
      name: user.name,
    }
  });

  useEffect(() => {
    const call = client.call('default', callId);
    setCallInstance(call);
    
    // Join the call when component mounts
    const joinCall = async () => {
      try {
        await call.join({ create: true });
        console.log("Successfully joined call", callId);
      } catch (error) {
        console.error("Error joining call:", error);
      } finally {
        setIsJoining(false);
      }
    };
    
    joinCall();
    
    // Cleanup function
    return () => {
      // Leave call when component unmounts
      call.leave().catch(console.error);
    };
  }, [client, callId]);

  if (isJoining || !callInstance) {
    return <div>Joining call...</div>;
  }

  return (
    // Wrapper div with specific styling to isolate from global styles
    <div className="stream-video-container" style={{ 
      height: '100vh',
      width: '100%',
      color: '#333',
      backgroundColor: '#ffffff'
    }}>
      <StreamVideo client={client}>
        <StreamCall call={callInstance}>
          <MyUILayout />
        </StreamCall>
      </StreamVideo>
    </div>
  );
}

export const MyUILayout = () => {
  const {
    useCallCallingState,
    useLocalParticipant,
    useRemoteParticipants,
    // ... other hooks
  } = useCallStateHooks();

  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  if (callingState !== CallingState.JOINED) {
    return <div className="stream-loading-state" style={{ color: '#333', padding: '20px' }}>Loading...</div>;
  }

  return (
    <div className="stream-call-container" style={{ color: '#333' }}>
      <StreamTheme>
        <div className="stream-ui-wrapper" style={{ 
          height: '100vh', 
          width: '100%',
          // Fix CSS variable references - they should be hexadecimal color values, not var() references
          '--str-video-primary-color': '#3470FF', // Use blue that matches your primary color
          '--str-video-accent-color': '#F0F4FF',  // Light blue for accent
          // Add text colors to ensure visibility
          '--str-video-text-color': '#FFFFFF',
          '--str-video-background': '#FFFFFF',
          // Override any other problematic variables
          '--str-video-muted-text-color': '#666666',
        } as React.CSSProperties}>
          <SpeakerLayout participantsBarPosition='bottom' />
          <CallControls />
        </div>
      </StreamTheme>
    </div>
  );
};

export const MyParticipantList = (props: { participants: StreamVideoParticipant[] }) => {
  const { participants } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
      {participants.map((participant) => (
        <ParticipantView participant={participant} key={participant.sessionId} />
      ))}
    </div>
  );
};

export const MyFloatingLocalParticipant = (props: { participant?: StreamVideoParticipant }) => {
  const { participant } = props;
  return (
    <div
      style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        width: '240px',
        height: '135px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 3px',
        borderRadius: '12px',
      }}
    >
      {participant && <ParticipantView participant={participant} />}
    </div>
  );
};