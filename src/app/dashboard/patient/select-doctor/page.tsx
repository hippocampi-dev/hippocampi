import Link from "next/link";
import { Suspense } from "react";
import DoctorSearch from "~/components/patient-dashboard/DoctorSearch";
import DoctorsTable from "~/components/patient-dashboard/DoctorTable";
import Pagination from "~/components/patient-dashboard/Pagination";
import { Button } from "~/components/ui/button";
import { DoctorsTableSkeleton } from "~/components/ui/skeleton";
import { fetchDoctorsPages } from "~/server/db/queries";

export default async function Page(props: {
  searchParams?: Promise<{
    term?: string;
    specialization?: string;
    page: Number;
  }>;
}) {
  const searchParams = await props.searchParams;
  const term = searchParams?.term || "";
  const specialization = searchParams?.specialization || "";
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchDoctorsPages(term);

  console.log(term);
  console.log(specialization);
  console.log(currentPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cognitive Assessment Banner */}
      <div className="bg-primary/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-2xl font-bold">
              Find Your Perfect Doctor Match
            </h2>
            <p className="mb-6 text-lg">
              For tailored matching based on your specific needs and preferences
            </p>
            {/*Update Link in future*/}
            <Link href="/dashboard/patient/cognitive-assessment/1">
              <Button size="lg" className="px-8 py-6 text-lg font-medium">
                Take our Cognitive Assessment
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Find Your Doctor</h1>
        <DoctorSearch />
        <div>
          <Suspense
            key={term + currentPage}
            fallback={<DoctorsTableSkeleton />}
          >
            <DoctorsTable
              term={term}
              specialization={specialization}
              currentPage={currentPage}
            />
          </Suspense>
        </div>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </main>
    </div>
  );
}
