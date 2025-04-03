'use server'

import { StreamVideoClient } from '@stream-io/video-react-sdk';

export async function generateStreamToken(userId: string, userName: string) {
  try {
    // Initialize the Stream client with the API key and secret
    const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!;
    const apiSecret = process.env.STREAM_VIDEO_API_SECRET!;

    if (!apiKey || !apiSecret) {
      throw new Error('Stream API credentials are not configured');
    }

    // Create a server-side client instance
    const client = new StreamVideoClient({
      apiKey,
      secret: apiSecret,
      // Turn off browser detection since we're in a server environment
      browserDetection: false,
    });

    // Generate a token for the user
    const token = client.createToken(userId);

    return {
      success: true,
      token,
      apiKey,
    };
  } catch (error) {
    console.error('Failed to generate Stream token:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function createMeeting(appointmentId: string, hostId: string) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!;
    const apiSecret = process.env.STREAM_VIDEO_API_SECRET!;

    if (!apiKey || !apiSecret) {
      throw new Error('Stream API credentials are not configured');
    }

    // Create a server-side client instance
    const client = new StreamVideoClient({
      apiKey,
      secret: apiSecret,
      browserDetection: false,
    });

    // Create a call/meeting with the appointment ID as the meeting ID
    const call = await client.call('default', appointmentId);
    
    return {
      success: true,
      callId: appointmentId,
    };
  } catch (error) {
    console.error('Failed to create meeting:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
