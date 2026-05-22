import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LogOut, LayoutDashboard, Mic2, Radio, Handshake, Users, FileImage,
  Mail, Settings, GraduationCap, UserCheck, MessageSquare, FileText,
  ListChecks, ChevronLeft, ChevronRight, ExternalLink, TrendingUp,
  Zap, BarChart3, Lock,
} from "lucide-react";
import { SpeakersManager } from "./SpeakersManager";
import { StreamsManager } from "./StreamsManager";
import { SponsorsManager } from "./SponsorsManager";
import { ParticipantsManager } from "./ParticipantsManager";
import { LeadsManager } from "./LeadsManager";
import { MediaUploader } from "./MediaUploader";
import { SiteSettingsManager } from "./SiteSettingsManager";
import { AcademyCoursesManager } from "./AcademyCoursesManager";
import { AcademyTeachersManager } from "./AcademyTeachersManager";
import { AcademyReviewsManager } from "./AcademyReviewsManager";
import { ReportsManager } from "./ReportsManager";
import { ChecklistsManager } from "./ChecklistsManager";
import { BrandTitle } from "@/components/BrandTitle";
import { api } from "@/lib/api";
import type { LeadStats } from "@/lib/api";

interface NavGroup {
  label: string;
  items: { id: string; label: string; icon: typeof LayoutDashboard; badge?: number }[];
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [stats, setStats] = useState<LeadStats>({ exhibition: 0, speakers: 0, sponsors: 0, tickets: 0, research: 0 });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      api.auth.verify()
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          localStorage.removeItem("admin_token");
          setIsAuthenticated(false);
        })
        .finally(() => setAuthChecked(true));
    } else {
      setAuthChecked(true);
    }
  }, []);

  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError("");
    try {
      const { token } = await api.auth.login(password);
      localStorage.setItem("admin_token", token);
      setIsAuthenticated(true);
    } catch {
      setLoginError("Неверный пароль");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await api.auth.logout(); } catch { /* ignore */ }
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    setPassword("");
  };

  useEffect(() => {
    if (isAuthenticated) {
      api.leads.stats().then(setStats).catch(() => {});
    }
  }, [isAuthenticated]);

  const totalLeads = stats.exhibition + stats.speakers + stats.sponsors + (stats.tickets || 0) + (stats.research || 0);

  const navGroups: NavGroup[] = [
    {
      label: "Основное",
      items: [
        { id: "dashboard", label: "Обзор", icon: LayoutDashboard },
        { id: "leads", label: "Заявки", icon: Mail, badge: totalLeads || undefined },
        { id: "settings", label: "Настройки", icon: Settings },
        { id: "media", label: "Медиа", icon: FileImage },
      ],
    },
    {
      label: "Контент",
      items: [
        { id: "reports", label: "Отчёты", icon: FileText },
        { id: "checklists", label: "Чек-листы", icon: ListChecks },
      ],
    },
    {
      label: "Конференция",
      items: [
        { id: "speakers", label: "Спикеры", icon: Mic2 },
        { id: "streams", label: "Потоки", icon: Radio },
        { id: "sponsors", label: "Спонсоры", icon: Handshake },
        { id: "participants", label: "Участники", icon: Users },
      ],
    },
    {
      label: "Академия",
      items: [
        { id: "academy-courses", label: "Курсы", icon: GraduationCap },
        { id: "academy-teachers", label: "Преподаватели", icon: UserCheck },
        { id: "academy-reviews", label: "Отзывы", icon: MessageSquare },
      ],
    },
  ];

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Проверка авторизации...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/[0.04] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/[0.04] rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-sm relative">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 flex items-center justify-center mx-auto mb-5 border border-neon-cyan/20">
              <Lock className="w-7 h-7 text-neon-cyan" />
            </div>
            <BrandTitle className="font-display text-2xl font-black" uppercase />
            <p className="text-muted-foreground text-sm mt-2">Панель управления</p>
          </div>
          <div className="rounded-2xl border border-neon-cyan/15 bg-card/80 backdrop-blur-sm p-6 shadow-xl shadow-neon-cyan/5">
            <form
              onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Пароль</label>
                <Input
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginLoading}
                  className="h-11 border-border/60 focus:border-neon-cyan/50"
                />
              </div>
              {loginError && (
                <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {loginError}
                </div>
              )}
              <Button type="submit" className="w-full h-11 bg-gradient-to-r from-neon-cyan to-neon-cyan/80 text-background font-bold hover:opacity-90 shadow-lg shadow-neon-cyan/20" disabled={loginLoading}>
                {loginLoading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const activeItem = navGroups.flatMap(g => g.items).find(i => i.id === activeTab);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col border-r border-border/60 bg-card/95 backdrop-blur-md transition-all duration-200 ${
          sidebarCollapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Logo + gradient line */}
        <div className="relative h-14 flex items-center px-4 border-b border-border/60 flex-shrink-0">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-neon-cyan/30 via-neon-magenta/20 to-transparent" />
          {!sidebarCollapsed ? (
            <BrandTitle className="font-display text-sm font-bold" uppercase />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 flex items-center justify-center mx-auto">
              <span className="text-neon-cyan font-black text-xs">ТП</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-1">
              {!sidebarCollapsed && (
                <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                  {group.label}
                </div>
              )}
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all relative ${
                      isActive
                        ? "text-neon-cyan font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                  >
                    {isActive && (
                      <>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gradient-to-b from-neon-cyan to-neon-cyan/50 rounded-r" />
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/8 via-neon-cyan/3 to-transparent pointer-events-none" />
                      </>
                    )}
                    <item.icon className={`w-4 h-4 flex-shrink-0 relative ${isActive ? "text-neon-cyan" : ""}`} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left relative">{item.label}</span>
                        {item.badge && (
                          <span className="relative px-1.5 py-0.5 rounded-full bg-gradient-to-r from-neon-magenta/20 to-neon-magenta/10 text-neon-magenta text-[10px] font-bold min-w-[20px] text-center">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-border/60 p-2 flex-shrink-0 space-y-1 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /> Свернуть</>}
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/5 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {!sidebarCollapsed && "Открыть сайт"}
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            {!sidebarCollapsed && "Выйти"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-200 ${
          sidebarCollapsed ? "ml-16" : "ml-60"
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-14 flex items-center justify-between px-6 border-b border-border/60 bg-background/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {activeItem && <activeItem.icon className="w-4.5 h-4.5 text-neon-cyan" />}
            <h1 className="font-display text-lg font-bold">
              {activeItem?.label || "Обзор"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Online</span>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {activeTab === "dashboard" && <DashboardView stats={stats} onNavigate={setActiveTab} />}
          {activeTab === "speakers" && <SpeakersManager />}
          {activeTab === "streams" && <StreamsManager />}
          {activeTab === "sponsors" && <SponsorsManager />}
          {activeTab === "participants" && <ParticipantsManager />}
          {activeTab === "media" && <MediaUploader />}
          {activeTab === "reports" && <ReportsManager />}
          {activeTab === "checklists" && <ChecklistsManager />}
          {activeTab === "leads" && <LeadsManager />}
          {activeTab === "settings" && <SiteSettingsManager />}
          {activeTab === "academy-courses" && <AcademyCoursesManager />}
          {activeTab === "academy-teachers" && <AcademyTeachersManager />}
          {activeTab === "academy-reviews" && <AcademyReviewsManager />}
        </div>
      </main>
    </div>
  );
}

function DashboardView({ stats, onNavigate }: { stats: LeadStats; onNavigate: (tab: string) => void }) {
  const totalLeads = stats.exhibition + stats.speakers + stats.sponsors + (stats.tickets || 0) + (stats.research || 0);

  const cards = [
    { label: "Выставка", value: stats.exhibition, icon: LayoutDashboard, gradient: "from-neon-cyan/20 to-neon-cyan/5", border: "border-neon-cyan/20 hover:border-neon-cyan/40", text: "text-neon-cyan", shadow: "hover:shadow-neon-cyan/10" },
    { label: "Спикеры", value: stats.speakers, icon: Mic2, gradient: "from-neon-magenta/20 to-neon-magenta/5", border: "border-neon-magenta/20 hover:border-neon-magenta/40", text: "text-neon-magenta", shadow: "hover:shadow-neon-magenta/10" },
    { label: "Спонсоры", value: stats.sponsors, icon: Handshake, gradient: "from-neon-cyan/20 to-neon-cyan/5", border: "border-neon-cyan/20 hover:border-neon-cyan/40", text: "text-neon-cyan", shadow: "hover:shadow-neon-cyan/10" },
    { label: "Билеты", value: stats.tickets || 0, icon: TrendingUp, gradient: "from-neon-magenta/20 to-neon-magenta/5", border: "border-neon-magenta/20 hover:border-neon-magenta/40", text: "text-neon-magenta", shadow: "hover:shadow-neon-magenta/10" },
    { label: "Отчёты", value: stats.research || 0, icon: BarChart3, gradient: "from-neon-cyan/20 to-neon-cyan/5", border: "border-neon-cyan/20 hover:border-neon-cyan/40", text: "text-neon-cyan", shadow: "hover:shadow-neon-cyan/10" },
  ];

  const quickLinks = [
    { label: "Добавить спикера", tab: "speakers", icon: Mic2, color: "text-neon-cyan", bg: "bg-neon-cyan/10 group-hover:bg-neon-cyan/20" },
    { label: "Добавить отчёт", tab: "reports", icon: FileText, color: "text-neon-magenta", bg: "bg-neon-magenta/10 group-hover:bg-neon-magenta/20" },
    { label: "Добавить чек-лист", tab: "checklists", icon: ListChecks, color: "text-neon-cyan", bg: "bg-neon-cyan/10 group-hover:bg-neon-cyan/20" },
    { label: "Настройки сайта", tab: "settings", icon: Settings, color: "text-neon-magenta", bg: "bg-neon-magenta/10 group-hover:bg-neon-magenta/20" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative p-6 rounded-2xl border border-neon-cyan/20 bg-gradient-to-br from-neon-cyan/[0.06] via-card to-neon-magenta/[0.04] overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-neon-magenta/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-neon-cyan" />
            <span className="text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em]">Панель управления</span>
          </div>
          <h2 className="font-display text-2xl font-black mb-2">
            Добро пожаловать в <span className="text-neon-cyan">Технолог</span><span className="text-neon-magenta">ИИ</span> <span className="text-neon-cyan">Права</span>
          </h2>
          <p className="text-muted-foreground text-sm">
            {totalLeads > 0 ? `У вас ${totalLeads} новых заявок. ` : ""}Управляйте контентом, спикерами и настройками платформы.
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div>
        <h2 className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mb-4">Статистика заявок</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {cards.map((c) => (
            <button
              key={c.label}
              onClick={() => onNavigate("leads")}
              className={`group relative text-left p-5 rounded-2xl border bg-card/80 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-xl overflow-hidden ${c.border} ${c.shadow}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <c.icon className={`w-4.5 h-4.5 ${c.text} opacity-60`} />
                  <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">{c.label}</span>
                </div>
                <p className={`text-3xl font-display font-black ${c.text}`}>{c.value}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => onNavigate(link.tab)}
              className="group flex items-center gap-3 p-4 rounded-2xl border border-border/60 bg-card/50 hover:border-neon-cyan/20 hover:bg-card transition-all text-left"
            >
              <div className={`w-10 h-10 rounded-xl ${link.bg} flex items-center justify-center transition-colors`}>
                <link.icon className={`w-5 h-5 ${link.color}`} />
              </div>
              <span className="text-sm font-medium">{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
