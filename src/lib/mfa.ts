import { authenticator } from "otplib"
import qrcode from "qrcode"

export function generateTOTPSecret(email: string) {
  const secret = authenticator.generateSecret()
  const otpauth = authenticator.keyuri(email, "Your App Name", secret)
  return { secret, otpauth }
}

export async function generateQRCode(otpauth: string) {
  try {
    return await qrcode.toDataURL(otpauth)
  } catch (error) {
    console.error("Error generating QR code:", error)
    throw error
  }
}

export function verifyTOTP(token: string, secret: string) {
  return authenticator.verify({ token, secret })
}