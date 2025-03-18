import { CredentialsInterface } from "~/app/(dashboard)/onboarding/credentials/page"

/**
 * Creates a mock File object for testing
 * @param name The name of the file
 * @param type The MIME type of the file
 * @returns A mock File object
 */
function createMockFile(name: string, type = "application/pdf"): File {
  // In a browser environment, we'd use the File constructor
  // For Node.js testing, we can create a mock File-like object
  const blob = new Blob(["mock file content"], { type })

  // Create a File object if in a browser environment
  if (typeof File !== "undefined") {
    return new File([blob], name, { type })
  }

  // For Node.js, create a File-like object
  return {
    name,
    type,
    size: blob.size,
    lastModified: Date.now(),
    slice: blob.slice.bind(blob),
    arrayBuffer: blob.arrayBuffer.bind(blob),
    stream: blob.stream.bind(blob),
    text: blob.text.bind(blob),
  } as File
}

/**
 * Creates test data for the CredentialsInterface
 * @returns A CredentialsInterface object with test data
 */
export function createTestCredentials(): CredentialsInterface {
  return {
    npi: {
      npiNumber: "1234567890",
      file: createMockFile("npi-document.pdf"),
    },
    license: {
      licenseNumber: "MD12345",
      expirationDate: "2025-12-31",
      file: createMockFile("medical-license.pdf"),
    },
    dea: {
      deaNumber: "XY1234567",
      startDate: "2020-01-01",
      expirationDate: "2023-12-31",
      file: createMockFile("dea-certificate.pdf"),
    },
    malpractice: {
      policyNumber: "POL987654321",
      insurerName: "Medical Protective Insurance",
      startDate: "2023-01-01",
      expirationDate: "2024-01-01",
      coverageAmount: "1000000",
      file: createMockFile("malpractice-policy.pdf"),
    },
    certifications: {
      certifications: [
        {
          id: "cert-1",
          organization: "American Board of Internal Medicine",
          name: "Board Certification in Internal Medicine",
          dateReceived: "2018-06-15",
          expirationDate: "2028-06-15",
          file: createMockFile("internal-medicine-cert.pdf"),
        },
        {
          id: "cert-2",
          organization: "American Heart Association",
          name: "Advanced Cardiac Life Support (ACLS)",
          dateReceived: "2022-03-10",
          expirationDate: "2024-03-10",
          file: createMockFile("acls-cert.pdf"),
        },
        {
          id: "cert-3",
          organization: "Hospital Credentialing Committee",
          name: "Hospital Privileges",
          dateReceived: "2021-09-01",
          // No expiration date for this one
          file: createMockFile("hospital-privileges.pdf"),
        },
      ],
    },
  }
}