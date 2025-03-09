'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter'; 

export default function Hero() {
  return (
    <section className="relative py-30 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white opacity-90 z-0"></div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Connect with Sri Lanka&apos;s Top{' '}
                <span className="text-green-600 block">
                  <Typewriter
                    words={[
                      'Developers',
                      'Designers',
                      'Writers',
                      'Marketers',
                      'Freelancers',
                    ]}
                    loop={true}
                    cursor
                    cursorStyle="_"
                    typeSpeed={100}
                    deleteSpeed={50}
                    delaySpeed={2000}
                  />
                </span>
              </h1>
            </motion.div>

            <motion.p
              className="text-xl text-gray-600 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Sri Lanka&apos;s first dedicated platform connecting businesses with skilled local freelancers. Find the perfect talent for your project in minutes.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                href="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 text-center"
              >
                Get Started
              </Link>
              <Link
                href="#how-it-works"
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 text-center"
              >
                How It Works
              </Link>
            </motion.div>

            <motion.div
              className="pt-6 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Already connecting over 1,000+ talents with local businesses
            </motion.div>
          </div>

          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative h-80 md:h-96 lg:h-[500px] w-full">
              <Image
                src="/landing-img.png"
                alt="Sri Lankan freelancers working"
                fill
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
