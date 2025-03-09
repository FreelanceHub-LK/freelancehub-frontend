'use client'
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="relative h-10 w-10 mr-3">
                <Image
                  src="/api/placeholder/40/40"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-xl font-bold text-white">FreelanceHub</h2>
            </div>
            <p className="text-gray-400">
              Sri Lanka's premier platform connecting local businesses with skilled freelance professionals.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/projects" className="text-gray-400 hover:text-white transition-colors">
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link href="/freelancers" className="text-gray-400 hover:text-white transition-colors">
                  Find Freelancers
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-gray-400 hover:text-white transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog & Resources
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/web-development" className="text-gray-400 hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/category/mobile-apps" className="text-gray-400 hover:text-white transition-colors">
                  Mobile Apps
                </Link>
              </li>
              <li>
                <Link href="/category/design" className="text-gray-400 hover:text-white transition-colors">
                  Design & Creative
                </Link>
              </li>
              <li>
                <Link href="/category/writing" className="text-gray-400 hover:text-white transition-colors">
                  Writing & Translation
                </Link>
              </li>
              <li>
                <Link href="/category/marketing" className="text-gray-400 hover:text-white transition-colors">
                  Digital Marketing
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                <span className="text-gray-400">
                  123 Tech Hub, Colombo 7, Sri Lanka
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-400">+94 11 123 4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <a href="mailto:info@freelancesl.lk" className="text-gray-400 hover:text-white transition-colors">
                  info@freelancehub.lk
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="bg-gray-950 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} FreelanceSL. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;