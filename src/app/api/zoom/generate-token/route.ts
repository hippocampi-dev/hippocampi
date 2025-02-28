import { NextResponse } from "next/server"

const ZOOM_API_KEY = process.env.ZOOM_API_KEY;
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET;
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;

export interface TokenResponse {
  access_token: string,
  token_type: string
  expires_in: number,
  scope : string,
  api_url: string
}

export async function GenerateToken(): Promise<TokenResponse | null> {
  const formData = new URLSearchParams({
    grant_type: "account_credentials",
    account_id: ZOOM_ACCOUNT_ID!
  });

  try {
    const response = await fetch("https://zoom.us/oauth/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(ZOOM_API_KEY + ':' + ZOOM_API_SECRET).toString('base64')}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating Zoom token:", error);
    return null;
  }
}