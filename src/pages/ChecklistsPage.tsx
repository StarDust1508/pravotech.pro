import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ChecklistsSection } from "@/components/ChecklistsSection";
import { Footer } from "@/components/Footer";
import { FloatingCubes } from "@/components/FloatingCubes";

export default function ChecklistsPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingCubes />
      <Navbar />
      <div className="relative z-10 pt-24">
        <ChecklistsSection />
      </div>
      <Footer />
    </div>
  );
}
