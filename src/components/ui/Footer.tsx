import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 py-8 text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between">
          <div className="mb-6 w-full md:mb-0 md:w-1/4">
            <h3 className="mb-2 text-xl font-bold text-gray-400">Hippocampi</h3>
            <p className="text-gray-400">Personalized post-chemo care</p>
          </div>
          <div className="mb-6 w-full md:mb-0 md:w-1/4">
            <h4 className="mb-2 text-lg font-semibold text-gray-400">
              Quick Links
            </h4>
            <ul>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="mb-6 w-full md:mb-0 md:w-1/4">
            <h4 className="mb-2 text-lg font-semibold">Contact</h4>
            <p className="text-gray-400">info@hippocampi.co</p>
            <p className="text-gray-400">+1 (818) 913-0022</p>
          </div>
          <div className="w-full md:w-1/4">
            <h4 className="mb-2 text-lg font-semibold">Follow Us</h4>
            <div className="flex space-x-4">
              {/* Add social media icons here */}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          © {new Date().getFullYear()} Hippocampi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
