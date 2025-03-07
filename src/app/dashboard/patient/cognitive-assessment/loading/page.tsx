'use client'
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { processAssessment } from "~/lib/actions/patient";

type responseInterface = {
  recommendations: string; selectedDoctors: { doctorId: string; }[]; 
}

export default function Results() {
  const [data, setData] = useState<responseInterface>();
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
      const res = await processAssessment();
      setData(res);
    } catch (error) {
      return error;
    } 
  }
  fetchData();
  })
  localStorage.setItem("assessment results", JSON.stringify(data))
  router.push("/dashboard/patient/cognitive-assessment/results")
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <Loader2 className="mb-4 h-16 w-16 animate-spin text-primary" />
      <p className="text-xl font-semibold">Processing your assessment...</p>
      <p className="mt-2 text-muted-foreground">This may take a few moments</p>
    </div>
  );
}

