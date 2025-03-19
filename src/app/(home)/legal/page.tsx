import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { ChevronRight, FileText, Shield, Scale } from "lucide-react";
import { Header } from "~/components/ui/Header";

export default function LegalPage() {
  const legalDocuments = [
    {
      title: "Privacy Policy",
      description: "How we collect, use, and protect your personal information",
      icon: <Shield className="h-6 w-6" />,
      link: "/legal/privacy-policy",
    },
    {
      title: "Terms of Use",
      description: "The rules and guidelines for using our services",
      icon: <FileText className="h-6 w-6" />,
      link: "/legal/terms-of-use",
    },
    {
      title: "Nondiscrimination Notice",
      description: "Our commitment to equal treatment and opportunity for all individuals",
      icon: <Scale className="h-6 w-6" />,
      link: "/legal/nondiscrimination-notice",
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Header */}
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-4 text-center">
              <h1 className="animate-fade-in text-3xl font-bold tracking-tighter sm:text-5xl">
                Legal Information
              </h1>
              <div className="animate-grow-width h-1 w-24 rounded-full bg-primary"></div>
              <p className="animate-fade-in-up text-muted-foreground md:text-lg">
                Access our legal documents and policies governing the use of Hippocampi's services.
              </p>
            </div>
          </div>
        </section>

        {/* Legal Documents Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-1 lg:gap-12">
              {legalDocuments.map((document) => (
                <Link 
                  key={document.title} 
                  href={document.link}
                  className="group"
                >
                  <div className="animate-fade-in-up flex flex-col overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {document.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{document.title}</h3>
                        <p className="mt-1 text-muted-foreground">{document.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="w-full bg-muted/50 py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-2xl font-bold tracking-tighter md:text-3xl">
                Our Commitment to Transparency
              </h2>
              <p className="text-muted-foreground">
                At Hippocampi, we believe in being clear and open about how we use your data and how you can 
                interact with our services. We're committed to protecting your privacy and ensuring equal 
                access to our platform for all individuals.
              </p>
              <div className="pt-4">
                <Button variant="outline" className="transition-all duration-300 hover:scale-105">
                  Contact Our Legal Team
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-background py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">Hippocampi</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transforming cognitive and mental health care for cancer
                patients through innovation and compassion.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Our Approach
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Team
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/legal/privacy-policy"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/terms-of-use"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/nondiscrimination-notice"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Nondiscrimination
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Hippocampi, Inc. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
