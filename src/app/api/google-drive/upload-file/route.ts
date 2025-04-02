import { NextResponse } from "next/server";
import { google } from "googleapis";
import mime from "mime";
import { Readable } from "stream";
import { authenticateGoogle } from "~/utilities/google";

// upload function
const uploadFileToDrive = async (
  folderId: string,
  file: any,
  driveId: string
) => {
  const auth = authenticateGoogle();
  const drive = google.drive({ version: "v3", auth });

  const mimeType = mime.getType(file.name);

  const fileMetadata = {
    name: file.name,
    parents: [folderId],
    driveId: driveId,
    mimeType: mimeType,
  };

  const fileBuffer = file.stream();

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: {
      mimeType: mimeType!,
      body: Readable.from(fileBuffer),
    },
    fields: "id", // only return the file ID, we don't need all the other information
    supportsAllDrives: true, // required to allow folders to be created in shared drives
  });

  // get file link
  const fileLink = await drive.files.get({
    fileId: response.data.id!,
    fields: "webViewLink",
    supportsAllDrives: true,
  });

  return fileLink.data;
};

// POST request handler
export async function POST(req: Request) {
  const {folderId, driveId, file} = await req.json();

  if (!folderId || !driveId || !file) {
    return NextResponse.json(
      {
        error: "Missing folderId, driveId, or file",
      },
      {
        status: 400,
      }
    );
  }

  const fileLink = await uploadFileToDrive(folderId, file, driveId);

  return NextResponse.json(
    {
      fileLink,
    },
    {
      status: 200,
    }
  );
}