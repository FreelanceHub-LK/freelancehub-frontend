'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How do I sign up as a freelancer?",
    answer: "You can sign up as a freelancer by clicking the 'Get Started' button, choosing the freelancer option, and completing your profile with your skills, experience, and portfolio."
  },
  {
    question: "What types of payment methods are supported?",
    answer: "We support secure payments through PayHere, which offers various options including credit/debit cards, bank transfers, and mobile payment methods popular in Sri Lanka."
  },
  {
    question: "How much does it cost to hire a freelancer?",
    answer: "Freelancer rates vary depending on their skills, experience, and the complexity of your project. You can view freelancers' hourly rates or project-based fees on their profiles."
  },
  {
    question: "Is there a fee for using the platform?",
    answer: "Yes, we charge a small service fee to maintain the platform. Clients pay a 5% fee on payments, while freelancers pay a 10% fee on earnings. These fees help us provide secure payments, customer support, and continuous platform improvements."
  },
  {
    question: "How do you verify freelancers?",
    answer: "We verify freelancers through a comprehensive process that includes ID verification, skill assessment, and portfolio review. We also maintain a rating system based on client feedback."
  },
  {
    question: "What happens if I'm not satisfied with the work?",
    answer: "We offer dispute resolution services. If you're not satisfied with the work, you can raise a dispute within our platform. Our team will review the case and help reach a fair resolution."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our platform
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <button
                className="flex justify-between items-center w-full p-6 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-lg text-gray-900">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${activeIndex === index ? 'transform rotate-180' : ''}`}
                />
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-600 border-t border-gray-100">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;