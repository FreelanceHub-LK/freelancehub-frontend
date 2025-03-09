'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    content: "Finding qualified developers in Sri Lanka used to be challenging until I discovered this platform. I hired a full-stack developer within 48 hours who delivered exceptional work.",
    author: "Dinesh Perera",
    position: "CTO, TechLanka",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    isFreelancer: false
  },
  {
    id: 2,
    content: "As a freelance content writer, this platform has connected me with quality clients who value my work. The local payment system makes everything so much easier.",
    author: "Priyanka Jayawardena",
    position: "Content Writer",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    isFreelancer: true
  },
  {
    id: 3,
    content: "We needed a UI designer for our startup and found the perfect match through this platform. The communication was seamless and the quality exceeded our expectations.",
    author: "Ahmed Fazil",
    position: "Founder, EduSL",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    isFreelancer: false
  }
];

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What People Are Saying</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our clients and freelancers about their experience using our platform
          </p>
        </div>
        
        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
              
              <div className="flex items-center">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">
                    {testimonial.position}
                    <span className="ml-2 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {testimonial.isFreelancer ? 'Freelancer' : 'Client'}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;