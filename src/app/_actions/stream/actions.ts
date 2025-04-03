'use server'

import { UserRequest } from '@stream-io/node-sdk';
import { User } from '@stream-io/video-react-sdk';
import { getUser } from '~/server/db/queries';
import { getUserId } from '~/utilities/getUser';
import { client } from '~/utilities/stream';



export async function generateStreamUserInfo() {
  try {
    const user: UserRequest = { ...await getUserDetails(), id: (await getUserDetails()).id || 'default-id' };
    await client.upsertUsers([user]);
    // Initialize the Stream client with the API key and secret
    const validity = 24 * 60 * 60;
    // Generate a token for the user
    const token = client.generateUserToken({ user_id: user.id || 'default-id', validity_in_seconds: validity });

    return {
      success: true,
      token,
      user,
    };
  } catch (error) {
    console.error('Failed to generate Stream token:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}


const getUserDetails = async (): Promise<User> => {
  const userId = await getUserId() as "string";
  const currentUser = await getUser(userId);
  const user: User = {
    id: currentUser?.id || 'default-id', // Provide a fallback value for id
    name: currentUser?.name || 'Anonymous', // Provide a fallback value for name
    image: currentUser?.image ?? undefined,
  };
  
  return user;
};