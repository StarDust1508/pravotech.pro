import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { AcademySection } from "@/components/AcademySection";
import { Footer } from "@/components/Footer";
import { FloatingCubes } from "@/components/FloatingCubes";

export default function AcademyPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingCubes />
      <Navbar />
      <div className="relative z-10 pt-24">
        <AcademySection />
      </div>
      <Footer />
    </div>
  );
}
