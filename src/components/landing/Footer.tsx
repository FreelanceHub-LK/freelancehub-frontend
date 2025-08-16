"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ArrowUp,
  Heart
} from "lucide-react";
import { useState, useEffect } from "react";

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    platform: [
      { name: "How It Works", href: "#how-it-works" },
      { name: "Features", href: "#features" },
      { name: "Browse Freelancers", href: "/freelancers" },
      { name: "Post a Project", href: "/projects/create" },
      { name: "Success Stories", href: "#testimonials" },
    ],
    categories: [
      { name: "Web Development", href: "/categories/web-development" },
      { name: "Graphic Design", href: "/categories/graphic-design" },
      { name: "Digital Marketing", href: "/categories/digital-marketing" },
      { name: "Content Writing", href: "/categories/content-writing" },
      { name: "Mobile Apps", href: "/categories/mobile-apps" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Safety & Security", href: "/safety" },
      { name: "Trust & Safety", href: "/trust-safety" },
      { name: "Dispute Resolution", href: "/dispute-resolution" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Blog", href: "/blog" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/freelancehub", name: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/freelancehub", name: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/freelancehub", name: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/freelancehub", name: "Instagram" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <>
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-teal-500 to-cyan-500 rounded-full blur-3xl translate-x-48 translate-y-48" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="py-16"
          >
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
              {/* Company Info */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Link href="/" className="inline-block mb-6">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    FreelanceHub
                  </div>
                </Link>
                <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                  Sri Lanka&apos;s leading freelancing platform connecting talented 
                  professionals with businesses worldwide. Build your career or grow 
                  your business with trusted freelancers.
                </p>
                
                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center text-gray-300">
                    <Mail className="w-5 h-5 mr-3 text-green-400" />
                    <span>hello@freelancehub.lk</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Phone className="w-5 h-5 mr-3 text-green-400" />
                    <span>+94 11 234 5678</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-5 h-5 mr-3 text-green-400" />
                    <span>Colombo, Sri Lanka</span>
                  </div>
                </div>
              </motion.div>

              {/* Platform Links */}
              <motion.div variants={itemVariants}>
                <h3 className="text-lg font-semibold mb-6 text-white">Platform</h3>
                <ul className="space-y-3">
                  {footerLinks.platform.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-green-400 transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Categories */}
              <motion.div variants={itemVariants}>
                <h3 className="text-lg font-semibold mb-6 text-white">Categories</h3>
                <ul className="space-y-3">
                  {footerLinks.categories.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-green-400 transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Support & Company */}
              <motion.div variants={itemVariants}>
                <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
                <ul className="space-y-3 mb-8">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-green-400 transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
                <ul className="space-y-3">
                  {footerLinks.company.slice(0, 3).map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-green-400 transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Newsletter Subscription */}
            <motion.div 
              variants={itemVariants}
              className="bg-gray-800/50 rounded-2xl p-8 mb-12 border border-gray-700"
            >
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Stay Updated
                </h3>
                <p className="text-gray-300 mb-6">
                  Get the latest freelancing tips, project opportunities, and platform updates 
                  delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Social Links & Bottom Bar */}
            <motion.div variants={itemVariants}>
              <div className="flex flex-col lg:flex-row justify-between items-center pt-8 border-t border-gray-700">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 lg:mb-0">
                  <div className="flex items-center space-x-4">
                    {socialLinks.map((social) => (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-500 transition-all duration-200"
                      >
                        <social.icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-6 text-sm">
                    {footerLinks.company.slice(3).map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-400">
                  <span>Made with</span>
                  <Heart className="w-4 h-4 mx-1 text-red-500" />
                  <span>in Sri Lanka © 2025 FreelanceHub. All rights reserved.</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-50"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </>
  );
};

export default Footer;
