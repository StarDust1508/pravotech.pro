import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, LayoutDashboard, Mic2, Radio, Handshake, Users, FileImage, Mail, Settings, GraduationCap, UserCheck, MessageSquare } from "lucide-react";
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
import { BrandTitle } from "@/components/BrandTitle";
import { api } from "@/lib/api";
import type { LeadStats } from "@/lib/api";

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [stats, setStats] = useState<LeadStats>({ exhibition: 0, speakers: 0, sponsors: 0, tickets: 0, research: 0 });

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
    try {
      await api.auth.logout();
    } catch { /* ignore */ }
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    setPassword("");
  };

  useEffect(() => {
    if (isAuthenticated) {
      api.leads.stats().then(setStats).catch(() => {});
    }
  }, [isAuthenticated]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Проверка авторизации...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center">Вход в админ-панель</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginLoading}
              />
              {loginError && <p className="text-sm text-red-500">{loginError}</p>}
              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-14">
          <h1 className="font-display font-bold text-lg">
            <BrandTitle uppercase /> — Админ
          </h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Выйти
          </Button>
        </div>
      </div>

      <div className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap gap-1 h-auto mb-6">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="w-4 h-4" /> Обзор
            </TabsTrigger>
            <TabsTrigger value="speakers" className="gap-2">
              <Mic2 className="w-4 h-4" /> Спикеры
            </TabsTrigger>
            <TabsTrigger value="streams" className="gap-2">
              <Radio className="w-4 h-4" /> Потоки
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="gap-2">
              <Handshake className="w-4 h-4" /> Спонсоры
            </TabsTrigger>
            <TabsTrigger value="participants" className="gap-2">
              <Users className="w-4 h-4" /> Участники
            </TabsTrigger>
            <TabsTrigger value="media" className="gap-2">
              <FileImage className="w-4 h-4" /> Медиа
            </TabsTrigger>
            <TabsTrigger value="leads" className="gap-2">
              <Mail className="w-4 h-4" /> Заявки
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" /> Настройки
            </TabsTrigger>
            <TabsTrigger value="academy-courses" className="gap-2">
              <GraduationCap className="w-4 h-4" /> Курсы
            </TabsTrigger>
            <TabsTrigger value="academy-teachers" className="gap-2">
              <UserCheck className="w-4 h-4" /> Преподаватели
            </TabsTrigger>
            <TabsTrigger value="academy-reviews" className="gap-2">
              <MessageSquare className="w-4 h-4" /> Отзывы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Заявки на выставку</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.exhibition}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Заявки спикеров</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.speakers}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Заявки спонсоров</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.sponsors}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Заявки на билеты</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.tickets || 0}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="speakers">
            <SpeakersManager />
          </TabsContent>

          <TabsContent value="streams">
            <StreamsManager />
          </TabsContent>

          <TabsContent value="sponsors">
            <SponsorsManager />
          </TabsContent>

          <TabsContent value="participants">
            <ParticipantsManager />
          </TabsContent>

          <TabsContent value="media">
            <MediaUploader />
          </TabsContent>

          <TabsContent value="leads">
            <LeadsManager />
          </TabsContent>

          <TabsContent value="settings">
            <SiteSettingsManager />
          </TabsContent>

          <TabsContent value="academy-courses">
            <AcademyCoursesManager />
          </TabsContent>

          <TabsContent value="academy-teachers">
            <AcademyTeachersManager />
          </TabsContent>

          <TabsContent value="academy-reviews">
            <AcademyReviewsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
