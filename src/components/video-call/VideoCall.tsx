'use client';

import { useEffect, useState } from 'react';
import {
  StreamVideo,
  StreamVideoClient,
  Call,
  CallControls,
  CallingState,
  SpeakerLayout,
  VideoPreview,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { generateStreamToken } from '~/app/_actions/stream/actions';
import { Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface VideoCallProps {
  appointmentId: string;
  userId: string;
  userName: string;
}

export function VideoCall({ appointmentId, userId, userName }: VideoCallProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeCall = async () => {
      try {
        setLoading(true);
        
        // Get token from server
        const tokenResponse = await generateStreamToken(userId, userName);
        
        if (!tokenResponse.success) {
          throw new Error(tokenResponse.error || 'Failed to generate token');
        }
        
        // Initialize the Stream client
        const videoClient = new StreamVideoClient({
          apiKey: tokenResponse.apiKey,
          token: tokenResponse.token,
          user: {
            id: userId,
            name: userName,
          },
        });

        setClient(videoClient);
        
        // Join or create the call
        const newCall = videoClient.call('default', appointmentId);
        await newCall.getOrCreate();
        setCall(newCall);
        
        // Join the call
        await newCall.join();
      } catch (err) {
        console.error('Error initializing video call:', err);
        setError(err instanceof Error ? err.message : 'An error occurred setting up the call');
      } finally {
        setLoading(false);
      }
    };

    initializeCall();
    
    // Cleanup on component unmount
    return () => {
      if (call) {
        call.leave().catch(console.error);
      }
      client?.disconnectUser().catch(console.error);
    };
  }, [appointmentId, userId, userName]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p>Setting up your video call...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 mb-4">Failed to set up call: {error}</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!client || !call) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Unable to initialize video call.</p>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <Call call={call}>
        <div className="h-screen flex flex-col">
          <div className="flex-1 bg-muted">
            <SpeakerLayout />
          </div>
          <div className="p-4 bg-background">
            <CallControls
              camera
              microphone
              screenShare
              leave
            />
          </div>
        </div>
      </Call>
    </StreamVideo>
  );
}

// Component to show before joining the call
export function VideoPreviewComponent({ 
  appointmentId, 
  userId, 
  userName, 
  onJoin 
}: VideoCallProps & { onJoin: () => void }) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeClient = async () => {
      try {
        setLoading(true);
        
        // Get token from server
        const tokenResponse = await generateStreamToken(userId, userName);
        
        if (!tokenResponse.success) {
          throw new Error(tokenResponse.error || 'Failed to generate token');
        }
        
        // Initialize the Stream client
        const videoClient = new StreamVideoClient({
          apiKey: tokenResponse.apiKey,
          token: tokenResponse.token,
          user: {
            id: userId,
            name: userName,
          },
        });

        setClient(videoClient);
      } catch (err) {
        console.error('Error initializing video client:', err);
        setError(err instanceof Error ? err.message : 'An error occurred setting up the call');
      } finally {
        setLoading(false);
      }
    };

    initializeClient();
    
    return () => {
      client?.disconnectUser().catch(console.error);
    };
  }, [userId, userName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 mb-4">Failed to set up preview: {error}</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Unable to initialize video preview.</p>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="max-w-xl w-full mb-4">
          <VideoPreview />
        </div>
        <Button size="lg" onClick={onJoin}>
          Join Call
        </Button>
      </div>
    </StreamVideo>
  );
}
