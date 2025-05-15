export const dynamic = 'force-dynamic';

import { getUrl } from "~/app/_actions/upload/actions"
import FileViewer from "~/components/admin-dashboard/credentials-view/FileViewer"
import { Suspense } from "react";
import Loading from "~/components/loading/page";

const path = "9af7b607-6d2e-43e2-9ce6-abdec4f2ebdc/credentials/npi-document/calm-anime-student-sleeping-v7hyzmgr9pi4lfyg.jpg"

export default function ViewFile() {
  return (
    <Suspense fallback={<Loading />}>
      <ViewFileContainer />
    </Suspense>
  );
}

async function ViewFileContainer() {
  const url = await getUrl(path);

  return (
    <main className="p-12 relative h-[50vh]">
      <FileViewer fileUrl={url} />
    </main>
  )
}