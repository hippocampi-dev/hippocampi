import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl text-white">Hippocampi</span>
              </div>
              <p className="text-sm text-white">
                Transforming cognitive and mental health care for cancer
                patients through innovation and compassion.
              </p>
            </div>
            {/* <div className="space-y-4">
              <h3 className="text-sm font-medium">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-white transition-colors hover:text-darkAccent"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-white transition-colors hover:text-darkAccent"
                  >
                    Our Approach
                  </Link>
                </li>
              </ul>
            </div> */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-darkAccent">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-white transition-colors hover:text-darkAccent"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-white transition-colors hover:text-darkAccent"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/patients"
                    className="text-sm text-white transition-colors hover:text-darkAccent"
                  >
                    Patients
                  </Link>
                </li>
                <li>
                  <Link
                    href="/providers"
                    className="text-sm text-white transition-colors hover:text-darkAccent"
                  >
                    Providers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-white transition-colors hover:text-darkAccent"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-darkAccent">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/legal/privacy-policy"
                    className="text-sm text-white transition-colors hover:text-darkAccent"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/terms-of-use"
                    className="text-sm text-white transition-colors hover:text-darkAccent"
                  >
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/nondiscrimination-notice"
                    className="text-sm text-white transition-colors hover:text-darkAccent"
                  >
                    Nondiscrimination
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
            <p className="text-xs text-white">
              &copy; {new Date().getFullYear()} Hippocampi, Inc. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
  );
}
