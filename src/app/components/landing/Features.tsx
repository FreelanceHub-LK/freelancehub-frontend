'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, Shield, DollarSign, MessageCircle, Globe, Clock } from 'lucide-react';

const features = [
  {
    icon: <Search className="w-6 h-6" />,
    title: 'Find Local Talent Fast',
    description: 'Search and filter among thousands of verified Sri Lankan freelancers with the exact skills you need.'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Verified Professionals',
    description: 'Every freelancer is verified with ID and skill verification to ensure quality and trust.'
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: 'Secure Payments',
    description: 'Integrated with PayHere for secure, escrow-based payments in Sri Lankan Rupees.'
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Direct Communication',
    description: 'Chat directly with freelancers to discuss your project requirements and expectations.'
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Local Expertise',
    description: 'Access professionals who understand Sri Lankan business contexts and requirements.'
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Quick Turnaround',
    description: 'Get your projects completed faster with dedicated local talent in your timezone.'
  }
];

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've built the most reliable platform for connecting Sri Lankan businesses with top local freelance talent.
          </p>
        </div>
        
        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;