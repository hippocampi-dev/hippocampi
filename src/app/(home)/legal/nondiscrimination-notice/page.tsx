import Link from "next/link";
import { Header } from "~/components/ui/Header";
import { ChevronLeft } from "lucide-react";

export default function NondiscriminationNoticePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Header */}
      <Header />

      <main className="flex-1 bg-background">
        {/* Hero Section */}
        <section className="relative w-full bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <Link 
                href="/legal" 
                className="mb-6 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Legal Information
              </Link>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nondiscrimination Notice</h1>
              <div className="mt-2 h-1 w-24 rounded-full bg-primary"></div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-8">
              <div className="prose max-w-none dark:prose-invert">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Hippocampi, Inc. complies with all applicable federal civil rights laws, including Section 1557 of the Affordable Care Act (Section 1557). Hippocampi, Inc. does not discriminate on the basis of race, color, national origin (including limited English proficiency and primary language), age, disability, or sex (consistent with the scope of sex discrimination described at 45 CFR § 92.101(a)(2)).
                </p>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight">Our Commitment</h2>
                <p className="text-muted-foreground">
                  In compliance with Section 1557 and other federal civil rights laws, we provide individuals the following in a timely manner and free of charge:
                </p>

                <div className="mt-6 space-y-6 rounded-md bg-muted/60 p-6">
                  <div>
                    <h3 className="text-xl font-medium text-foreground">Language Assistance Services</h3>
                    <p className="mt-2 text-muted-foreground">
                      Hippocampi, Inc. will provide language assistance services for individuals with limited English proficiency (including individuals' companions with limited English proficiency) to ensure meaningful access to our programs, activities, services, and other benefits. Language assistance services may include:
                    </p>
                    <ul className="mt-2 ml-6 list-disc space-y-1">
                      <li>Electronic and written translated documents</li>
                      <li>Qualified interpreters</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-foreground">Appropriate Auxiliary Aids and Services</h3>
                    <p className="mt-2 text-muted-foreground">
                      Hippocampi, Inc. will provide appropriate auxiliary aids and services for individuals with disabilities (including individuals' companions with disabilities) to ensure effective communication. Appropriate auxiliary aids and services may include:
                    </p>
                    <ul className="mt-2 ml-6 list-disc space-y-1">
                      <li>Qualified interpreters, including American Sign Language interpreters</li>
                      <li>Video remote interpreting</li>
                      <li>Information in alternate formats (including but not limited to large print, recorded audio, and accessible electronic formats)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium text-foreground">Reasonable Modifications</h3>
                    <p className="mt-2 text-muted-foreground">
                      Hippocampi, Inc. will provide reasonable modifications for qualified individuals with disabilities, when necessary to ensure accessibility and equal opportunity to participate in our programs, activities, services, or other benefits.
                    </p>
                  </div>
                </div>

                <div className="mt-8 rounded-md border border-primary/20 bg-primary/5 p-6">
                  <p className="font-medium">
                    To access our language assistance services, auxiliary aids and services, and for assistance in getting a reasonable modification, please contact:
                  </p>
                  <p className="mt-2">
                    <Link href="mailto:support@hippocampi.co" className="text-primary hover:underline">
                      support@hippocampi.co
                    </Link>
                  </p>
                </div>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight">Filing a Complaint</h2>
                <p className="text-muted-foreground">
                  If you believe Hippocampi, Inc. has failed to provide these services or has discriminated in another way on the basis of race, color, national origin, sex, age, or disability, you can file a complaint with the U.S. Department of Health and Human Services, Office for Civil Rights:
                </p>
                <ul className="mt-2 ml-6 list-disc space-y-1">
                  <li>
                    <Link 
                      href="https://ocrportal.hhs.gov/ocr/smartscreen/main.jsf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Online Complaint Portal
                    </Link>
                  </li>
                  <li>
                    U.S. Department of Health & Human Services<br />
                    200 Independence Avenue, S.W. – 509F<br />
                    Washington, D.C. 20201
                  </li>
                </ul>

                <p className="mt-8 text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-background py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex items-center space-x-4">
              <Link 
                href="/legal/privacy-policy" 
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Privacy Policy
              </Link>
              <div className="h-1 w-1 rounded-full bg-muted-foreground/50"></div>
              <Link 
                href="/legal/terms-of-use" 
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Terms of Use
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Hippocampi, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
