import Hero from "@/components/landing/Hero";
import Navbar from "@/components/features/Navbar";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div>
            <Navbar/>
       <main className="min-h-screen">
       <Hero/>
     <Features/>
     <HowItWorks/>
     <Testimonials/>
     <FAQ/>
     <CTA/>
     <Footer/>
       </main>

    
    </div>
  );
}
