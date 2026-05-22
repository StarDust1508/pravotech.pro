import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { AboutProjectSection } from "@/components/AboutProjectSection";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24">
        <AboutProjectSection />
      </div>
      <Footer />
    </div>
  );
}
