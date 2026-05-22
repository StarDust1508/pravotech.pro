import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import ConferencePage from "./pages/ConferencePage";
import NotFound from "./pages/NotFound";

const ResearchReportPage = lazy(() => import("./pages/ResearchReportPage"));
const ResearchPage = lazy(() => import("./pages/ResearchPage"));
const ChecklistPage = lazy(() => import("./pages/ChecklistPage"));
const ChecklistsPage = lazy(() => import("./pages/ChecklistsPage"));
const PlatformPage = lazy(() => import("./pages/PlatformPage"));
const BookPage = lazy(() => import("./pages/BookPage"));
const AcademyPage = lazy(() => import("./pages/AcademyPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LearnPage = lazy(() => import("./pages/LearnPage"));
const CoursePage = lazy(() => import("./pages/CoursePage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><AboutPage /></Suspense>} />
          <Route path="/research" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><ResearchPage /></Suspense>} />
          <Route path="/research/:slug" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><ResearchReportPage /></Suspense>} />
          <Route path="/checklists" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><ChecklistsPage /></Suspense>} />
          <Route path="/checklists/:slug" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><ChecklistPage /></Suspense>} />
          <Route path="/platform" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><PlatformPage /></Suspense>} />
          <Route path="/book" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><BookPage /></Suspense>} />
          <Route path="/academy" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><AcademyPage /></Suspense>} />
          <Route path="/courses/:slug" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><CoursePage /></Suspense>} />
          <Route path="/courses/:slug/learn" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><LearnPage /></Suspense>} />
          <Route path="/profile" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><ProfilePage /></Suspense>} />
          <Route path="/conference" element={<ConferencePage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
