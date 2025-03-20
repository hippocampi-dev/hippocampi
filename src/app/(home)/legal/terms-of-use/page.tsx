import Link from "next/link";
import { Header } from "~/components/ui/Header";
import { ChevronLeft } from "lucide-react";
import Footer from "~/components/ui/Footer";

export default function TermsOfUsePage() {
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
              <h1 className="text-3xl font-bold tracking-tight mb-1er sm:text-4xl md:text-5xl">Terms of Use</h1>
              <div className="mt-2 h-1 w-24 rounded-full bg-primary"></div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-8">
              <div className="prose max-w-none dark:prose-invert">
                <h2 className="text-2xl font-semibold tracking-tight mb-1">Acceptance of Terms of Use</h2>
                <p>
                  Welcome to Hippocampi, Inc. These Terms of Use (the "Terms") are a binding contract between you ("you" or "user") and Hippocampi, Inc. ("Hippocampi", "we", or "us"). You must agree to and accept all of the Terms, or you do not have the right to use the Services. Your using the Services in any way means that you agree to all of these Terms, and these Terms will remain in effect while you use the Services. These Terms include the provisions in this document, as well as those in our privacy policy.
                </p>
                <div className="rounded-md bg-amber-50 p-4 dark:bg-amber-900/20 mt-4">
                  <p className="font-medium">NOTICE:</p>
                  <p className="mt-1">
                    Please read these Terms carefully. They cover important information about Services provided to you and any charges, taxes, and fees we bill you. These Terms include information about future changes to these Terms, automatic renewals, limitations of liability, a class action waiver, and resolution of disputes by arbitration instead of in court. You can review the most current version of the Terms of Service at any time on this page. We reserve the right to update, change or replace any part of these Terms of Use by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.
                  </p>
                </div>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">General</h2>
                <p>
                  We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us. The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.
                </p>
                <p>
                  We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our Site (for example, by generating analytics about how our customers browse and interact with the Site, and to assess the success of our marketing and advertising campaigns).
                </p>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">Personal Information</h2>
                <p>Your submission of personal information is governed by our <Link href="/legal/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
                
                {/* Continue with the rest of the sections formatted in the same style */}
                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">Accuracy, Completeness, and Timeliness of Information</h2>
                <p>
                  We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk. This site may contain certain historical information. We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site.
                </p>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">Modifications to Services and Prices</h2>
                <p>
                  Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Services.
                </p>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">Third-Party Payment Processor</h2>
                <p>
                  You agree to pay us, through our payment processor or financing partner (as applicable), all charges at the prices then in effect for any purchase in accordance with the applicable payment terms presented to you at the time of purchase. You agree to make payment using the payment method you provide when you set up your account. We reserve the right to correct, or to instruct our payment processor or financing partner to correct, any errors or mistakes, even if payment has already been requested or received.
                </p>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">Bill Inquiries and Refunds</h2>
                <p>
                  If you believe you have been billed in error, please notify us within 30 days of the billing date by emailing <Link href={`mailto:${process.env.NEXT_PUBLIC_HIPPOCAMPI_EMAIL}`} className="text-primary hover:underline">{process.env.NEXT_PUBLIC_HIPPOCAMPI_EMAIL}</Link>. Hippocampi will not issue refunds or credits after the expiration of this 30-day period, except where required by applicable law.
                </p>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">Indemnification</h2>
                <p>
                  You agree to indemnify, defend and hold harmless Hippocampi and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys' fees, made by any third-party due to or arising out of your breach of these Terms of Service or the documents they incorporate by reference, or your violation of any law or the rights of a third-party.
                </p>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">Entire Agreement</h2>
                <p>
                  The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision. These Terms of Service and any policies or operating rules posted by us on this site or in respect to The Service constitutes the entire agreement and understanding between you and us and govern your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of the Terms of Service). Any ambiguities in the interpretation of these Terms of Service shall not be construed against the drafting party.
                </p>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">Health Insurance Portability Accountability Act (HIPAA)</h2>
                <p>
                  This document provides important information about the Health Insurance Portability Accountability Act (HIPAA), which protects the privacy of patient protected health information (PHI). HIPAA requires that we provide you a notice of privacy practices regarding your individual rights with respect to your personal health information and the privacy practices of health plans and healthcare providers.
                </p>
                
                <div className="mt-6 rounded-md bg-muted p-6">
                  <h3 className="text-xl font-medium">YOUR RIGHTS:</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <p className="font-medium">Get an electronic or paper copy of your medical record.</p>
                      <p className="mt-1">You can ask to see or get an electronic or paper copy of your medical record and other health information we have about you. Contact <Link href={`mailto:${process.env.NEXT_PUBLIC_HIPPOCAMPI_EMAIL}`} className="text-primary hover:underline">{process.env.NEXT_PUBLIC_HIPPOCAMPI_EMAIL}</Link>.</p>
                      <p className="mt-1">We will provide a copy or a summary of your health information, usually within 30 days of your request. We may charge a reasonable, cost-based fee.</p>
                    </li>
                    <li>
                      <p className="font-medium">Ask us to correct your medical record.</p>
                      <p className="mt-1">You can ask us to correct health information about you that you think is incorrect or incomplete. Ask us how to do this.</p>
                      <p className="mt-1">We may say "no" to your request, but we'll tell you why in writing within 60 days.</p>
                    </li>
                    {/* Additional rights with the same formatting pattern */}
                    <li>
                      <p className="font-medium">Request confidential communications.</p>
                      <p className="mt-1">You can ask us to contact you in a specific way (for example, home or office phone) or to send mail to a different address.</p>
                      <p className="mt-1">We will say "yes" to all reasonable requests.</p>
                    </li>
                    <li>
                      <p className="font-medium">Ask us to limit what we use or share.</p>
                      <p className="mt-1">You can ask us not to use or share certain health information for treatment, payment, or our operations.</p>
                      <p className="mt-1">We are not required to agree to your request, and we may say "no" if it would affect your care.</p>
                      <p className="mt-1">If you pay for a service or health care item out-of-pocket in full, you can ask us not to share that information for the purpose of payment or our operations with your health insurer.</p>
                      <p className="mt-1">We will say "yes" unless a law requires us to share that information.</p>
                      <p className="mt-1">The Head of AI and Machine Learning and the Chief Technological Officer may have access to certain health information you enter into forms hosted on the Hippocampi website. Any information accessible by the Head of AI and Machine Learning and the Chief Technological Officer will be used exclusively for the maintenance and development of the Hippocampi website and services available on the website and not for identification purposes.</p>
                    </li>
                  </ul>
                </div>

                {/* Continuing with additional sections */}
                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">Binding Arbitration</h2>
                <p>
                  By agreeing to the Terms of Use and utilizing the services provided by Hippocampi, you acknowledge and agree to resolve any disputes arising from or related to these Terms of Use or our services through binding arbitration, rather than in court. This agreement to arbitrate is intended to be broadly interpreted and includes, but is not limited to:
                </p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Claims arising out of or relating to any aspect of the relationship between you and Hippocampi, whether based in contract, tort, statute, fraud, misrepresentation, or any other legal theory;</li>
                  <li>Claims that arose before this or any prior agreement (including, but not limited to, claims relating to advertising);</li>
                  <li>Claims that are currently the subject of purported class action litigation in which you are not a member of a certified class; and</li>
                  <li>Claims that may arise after the termination of these Terms of Use.</li>
                </ul>

                <p className="mt-4">
                  Arbitration will be conducted by the American Arbitration Association (AAA) under its rules and procedures, including the AAA's Consumer Arbitration Rules (as applicable), as modified by this agreement. The AAA's rules are available at www.adr.org. The arbitration shall be conducted by a single, neutral arbitrator. Any judgment on the award rendered by the arbitrator may be entered in any court of competent jurisdiction. The arbitrator shall be empowered to grant whatever relief would be available in a court under law or in equity. The arbitrator's award shall be written and shall be binding on the parties.
                </p>

                <p className="mt-4">
                  You and Hippocampi agree that any proceedings to resolve or litigate any dispute will be conducted solely on an individual basis, and that neither you nor Hippocampi will seek to have any dispute heard as a class action, representative action, collective action, or private attorney general action. The arbitrator may not consolidate more than one person's claims and may not preside over any form of a representative or class proceeding. The arbitrator has no power to consider the enforceability of this class action waiver, and any challenge to the class action waiver may only be raised in a court of competent jurisdiction. If, for any reason, this class action waiver is found to be unenforceable, the agreement to arbitrate will not apply.
                </p>

                <p className="mt-4">
                  If any provision of this arbitration agreement is found to be unenforceable, the unenforceable provision shall be severed, and the remaining arbitration terms shall be enforced.
                </p>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">Informed Consent</h2>
                <p>
                  I, the undersigned, certify that I am the patient or the parent/legal guardian of the minor child(ren) named in this document. I voluntarily authorize the providers of Hippocampi to provide medical and/or medication management services as deemed necessary and advisable in their professional judgment. I understand the risks and benefits associated with medical treatments and assume responsibility for my participation.
                </p>

                {/* Additional important sections with consistent formatting */}
                
                <p className="mt-8 text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}




