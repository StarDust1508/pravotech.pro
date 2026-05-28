import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, Component, type ReactNode } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const Admin = lazy(() => import("./pages/Admin"));
const ConferencePage = lazy(() => import("./pages/ConferencePage"));
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
const ArticlesPage = lazy(() => import("./pages/ArticlesPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError(_error: Error) { return { hasError: true }; }
  componentDidCatch(error: Error) { console.error('App error:', error); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-white">Что-то пошло не так</h1>
            <button onClick={() => window.location.href = '/'} className="px-6 py-2 bg-cyan-500 text-black rounded-lg font-medium">На главную</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient();

const L = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 flex items-center justify-center animate-pulse">
          <span className="text-neon-cyan text-lg font-display font-black">ИИ</span>
        </div>
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent rounded-full animate-pulse" />
      </div>
    </div>
  }>{children}</Suspense>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<L><AboutPage /></L>} />
            <Route path="/research" element={<L><ResearchPage /></L>} />
            <Route path="/research/:slug" element={<L><ResearchReportPage /></L>} />
            <Route path="/checklists" element={<L><ChecklistsPage /></L>} />
            <Route path="/checklists/:slug" element={<L><ChecklistPage /></L>} />
            <Route path="/platform" element={<L><PlatformPage /></L>} />
            <Route path="/book" element={<L><BookPage /></L>} />
            <Route path="/academy" element={<L><AcademyPage /></L>} />
            <Route path="/courses/:slug" element={<L><CoursePage /></L>} />
            <Route path="/courses/:slug/learn" element={<L><LearnPage /></L>} />
            <Route path="/profile" element={<L><ProfilePage /></L>} />
            <Route path="/conference" element={<L><ConferencePage /></L>} />
            <Route path="/articles" element={<L><ArticlesPage /></L>} />
            <Route path="/products" element={<L><ProductsPage /></L>} />
            <Route path="/admin" element={<L><Admin /></L>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
