'use client'

export default function Loading() {
  // return (
  //   <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  //     {[1, 2, 3].map((i) => (
  //       <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />
  //     ))}
  //   </div>
  // );
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="space-y-4 w-full max-w-3xl px-4">
        <div className="h-12 bg-muted rounded-lg animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}