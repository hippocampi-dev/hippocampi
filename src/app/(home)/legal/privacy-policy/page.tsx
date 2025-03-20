import Link from "next/link";
import { Header } from "~/components/ui/Header";
import { ChevronLeft } from "lucide-react";
import Footer from "~/components/ui/Footer";

export default function PrivacyPolicyPage() {
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
              <h1 className="text-3xl font-bold tracking-tight mb-1er sm:text-4xl md:text-5xl">Privacy Policy</h1>
              <div className="mt-2 h-1 w-24 rounded-full bg-primary"></div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-8">
              <div className="prose max-w-none dark:prose-invert">
                <p className="text-lg text-muted-foreground">
                  At Hippocampi, Inc. ("Hippocampi", "we", "us", or "our"), we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and share your personal information when you use our website, products, or services. By using our services, you consent to the practices described in this policy.
                </p>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">Information We Collect</h2>
                <p>We may collect the following types of information:</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li><span className="font-medium">Personal information:</span> name, email address, phone number, billing information, and any other details you provide when creating an account, making a purchase, or contacting us.</li>
                  <li><span className="font-medium">Usage Data:</span> IP address, browser type, pages visited, time spent on our site, and other analytics to improve user experience.</li>
                  <li><span className="font-medium">Device Information:</span> Information about your device, including operating system, device type, and unique identifiers.</li>
                  <li><span className="font-medium">Cookies and Tracking Technologies:</span> We use cookies, pixels, and similar technologies to enhance your browsing experience, analyze site performance, and personalize content.</li>
                </ul>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">How We Use Your Information</h2>
                <p>We use the information we collect for the following purposes:</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li><span className="font-medium">Service Delivery:</span> To provide, manage, and improve our services, including health care provided by medical professionals, customer support, and our in-house non-data-sharing artificial intelligence model, which processes patients' health histories only after removing identifying information not relevant to the service being provided and complying with applicable data protection laws. We do not sell or share personally identifiable user data with third parties for AI training without explicit consent.</li>
                  <li><span className="font-medium">Personalization:</span> To customize user experiences and offer relevant recommendations.</li>
                  <li><span className="font-medium">Marketing & Communication:</span> To send promotional emails, newsletters, and blogs, where permitted by law.</li>
                  <li><span className="font-medium">Analytics & Research:</span> To analyze user behavior, improve our platform, and develop new features.</li>
                  <li><span className="font-medium">Legal Compliance:</span> To comply with applicable laws, respond to legal requests, and enforce our policies.</li>
                </ul>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">How We Share Your Information</h2>
                <p>We do not sell your personal information. However, we may share it in the following circumstances:</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li><span className="font-medium">With Service Providers:</span> We may share data with third-party vendors who assist with payment processing, analytics, hosting, and customer support.</li>
                  <li><span className="font-medium">For Legal Reasons:</span> If required by law, such as responding to subpoenas or preventing fraud.</li>
                  <li><span className="font-medium">Business Transfers:</span> If we undergo a merger, acquisition, or asset sale, your data may be transferred to the new entity.</li>
                </ul>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">Data Security & Retention</h2>
                <p>
                  We implement reasonable security measures to protect your personal data from unauthorized access, alteration, or destruction. However, no method of transmission over the internet is 100% secure. We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, and resolve disputes.
                </p>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">Your Rights & Choices</h2>
                <p>Depending on applicable law, you may have the following rights regarding your data:</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li><span className="font-medium">Access & Correction:</span> You can request access to or correction of your personal data.</li>
                  <li><span className="font-medium">Deletion:</span> You can request that we delete your personal data, subject to legal exceptions.</li>
                  <li><span className="font-medium">Opt-Out:</span> You can opt out of marketing communications and manage cookie preferences.</li>
                  <li><span className="font-medium">Data Portability:</span> In certain cases, you may request a copy of your data in a structured format.</li>
                </ul>
                <p>To exercise these rights, please contact us at <Link href={`mailto:${process.env.NEXT_PUBLIC_HIPPOCAMPI_EMAIL}`} className="text-primary hover:underline">{process.env.NEXT_PUBLIC_HIPPOCAMPI_EMAIL}</Link>.</p>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">Children's Privacy</h2>
                <p>
                  Our website is not intended for children under 16 years old. We do not knowingly collect personal information from minors. If we discover such data has been collected, we will take steps to delete it. This does not include information submitted on behalf of a minor under 16 years old by a parent or guardian.
                </p>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">International Data Transfers</h2>
                <p>
                  If you access our services from outside the United States, your data may be transferred and stored in a country with different data protection laws. By using our services, you consent to this transfer.
                </p>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">Changes to this Privacy Policy</h2>
                <p>
                  We may update this policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting an updated version on our website. Your continued use of our services after updates constitutes acceptance of the revised policy.
                </p>

                <h2 className="mt-8 text-2xl font-semibold tracking-tight mb-1">Contact Us</h2>
                <p>
                  If you have any questions about our Privacy Policy or your data rights, please contact us at <Link href={`mailto:${process.env.NEXT_PUBLIC_HIPPOCAMPI_EMAIL}`} className="text-primary hover:underline">{process.env.NEXT_PUBLIC_HIPPOCAMPI_EMAIL}</Link>.
                </p>

                <p className="mt-8 text-sm text-muted-foreground">
                  This privacy policy is designed to comply with applicable data protection laws.
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
