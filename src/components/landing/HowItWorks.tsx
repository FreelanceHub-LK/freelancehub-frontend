"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Post Your Project",
    description:
      "Describe your project needs, set your budget, and specify requirements",
    image: "/post-job.jpg",
  },
  {
    number: "02",
    title: "Get Proposals",
    description:
      "Receive detailed proposals from qualified Sri Lankan freelancers",
    image: "/get-proposal.jpg",
  },
  {
    number: "03",
    title: "Hire the Best Talent",
    description:
      "Review profiles, portfolios and select the perfect match for your project",
    image: "/hire-talent.jpg",
  },
  {
    number: "04",
    title: "Work Together",
    description:
      "Collaborate efficiently with messaging, file sharing, and milestone tracking",
    image: "/work-together.jpg",
  },
  {
    number: "05",
    title: "Pay Securely",
    description:
      "Release payments through our secure system when work meets your satisfaction",
    image: "/pay-secure.jpg",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our simple process makes it easy to find, hire and work with the
            best freelancers in Sri Lanka
          </p>
        </div>

        <div ref={ref} className="space-y-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-16`}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
            >
              <div className="w-full md:w-1/2 space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-bold text-green-600">
                    {step.number}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                </div>
                <p className="text-lg text-gray-600">{step.description}</p>
              </div>

              <div className="w-full md:w-1/2">
                <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
