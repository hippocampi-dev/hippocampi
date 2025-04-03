"use client";

import { motion } from "motion/react";
import Footer from "~/components/ui/Footer";
import { Header } from "~/components/ui/Header";

export default function Contact() {
  return (
    <>
      <Header />
      <main>
        <section className="w-full min-h-[90vh] flex flex-col px-9 py-16 gap-36">
          <h1 className="text-8xl font-light">Get in touch</h1>
          <div className="flex flex-col gap-12 w-1/3">
            <p className="text-2xl/8">If you have any questions or you'd like to find out more about our services, please get in touch.</p>
            <div className="flex flex-col gap-2">
              <p>Contact details</p>
              <div>
                <p className="text-darkAccent text-lg/7">Email: info@hippocampi.co</p>
                <p className="text-darkAccent text-lg/7">Phone: +1 (818) 913-0022</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
