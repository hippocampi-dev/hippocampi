import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <Loader2 className="mb-4 h-16 w-16 animate-spin text-primary" />
          <p className="text-xl font-semibold">Processing your assessment...</p>
          <p className="mt-2 text-muted-foreground">This may take a few moments</p>
        </div>
      );
}