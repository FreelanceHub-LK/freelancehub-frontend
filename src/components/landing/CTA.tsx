"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-20 bg-green-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Ready to find the perfect talent for your project?
          </motion.h2>

          <motion.p
            className="text-xl text-green-100 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of businesses and freelancers already connecting on
            Sri Lanka&apos;s premier freelancing platform
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/register?type=client"
              className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200"
            >
              Hire Talent
            </Link>
            <Link
              href="/register?type=freelancer"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200"
            >
              Find Work
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
