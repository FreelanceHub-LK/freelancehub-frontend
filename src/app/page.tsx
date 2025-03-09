import Image from "next/image";
import Hero from "./components/landing/Hero";
import Navbar from "./components/features/Navbar";
import Features from "./components/landing/Features";
import HowItWorks from "./components/landing/HowItWorks";

export default function Home() {
  return (
    <div>
      <Navbar/>
     <Hero/>
     <Features/>
     <HowItWorks/>
    </div>
  );
}
