import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  User, Mail, Phone, Save, CheckCircle2,
  Bot, BookOpen, FileCheck, BarChart3, GraduationCap,
  ArrowRight, Download, ExternalLink, Sparkles, Mic2, Layers,
  LogIn, UserPlus, LogOut, ShoppingBag, Eye, EyeOff,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingCubes } from "@/components/FloatingCubes";
import { GreetingOverlay } from "@/components/GreetingOverlay";
import { useUserProfile } from "@/hooks/useUserProfile";
import { api, Purchase } from "@/lib/api";

/* ── Deterministic gradient from name ── */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function avatarGradient(name: string) {
  const h = hashStr(name || "user");
  const hue1 = h % 360;
  const hue2 = (hue1 + 40 + (h >> 8) % 60) % 360;
  const hue3 = (hue2 + 50 + (h >> 16) % 70) % 360;
  const angle = (h >> 4) % 360;
  const x = 20 + (h >> 6) % 60;
  const y = 20 + (h >> 10) % 60;
  return {
    bg: `linear-gradient(${angle}deg, hsl(${hue1} 80% 55%) 0%, hsl(${hue2} 75% 45%) 50%, hsl(${hue3} 85% 50%) 100%)`,
    radial: `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
    hue1,
  };
}

/* ── Shared card shell ── */
function Card({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={`relative rounded-2xl overflow-hidden flex flex-col ${className}`}
      style={{ boxShadow: "0 20px 50px -15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0e1520] via-[#0c1220] to-[#0a0e18]" />
      <div className="absolute inset-0 rounded-2xl border border-white/[0.08]" />
      <div className="relative flex-1 flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}

/* ── Input field component ── */
function FormInput({
  label, icon: Icon, type = "text", value, onChange, placeholder, disabled = false,
}: {
  label: string;
  icon: React.ElementType;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground/45 mb-1">
        <Icon className="w-3 h-3" /> {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-sm focus:outline-none focus:border-neon-cyan/40 focus:bg-white/[0.05] focus:shadow-[0_0_20px_hsl(180_100%_50%/0.08)] transition-all placeholder:text-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

/* ── Auth Form (Login / Register) ── */
function AuthCard({
  onLogin,
  onRegister,
  delay = 0,
}: {
  onLogin: (data: { email: string; password: string }) => Promise<void>;
  onRegister: (data: { email: string; password: string; name?: string; phone?: string }) => Promise<void>;
  delay?: number;
}) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (tab === "login") {
        await onLogin({ email, password });
      } else {
        await onRegister({
          email,
          password,
          name: regName || undefined,
          phone: regPhone || undefined,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card delay={delay}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-neon-cyan/40 via-neon-magenta/20 to-transparent" />
      <div className="p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <LogIn className="w-4 h-4 text-neon-cyan" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Авторизация
          </h2>
        </div>

        <p className="text-foreground/40 text-xs mb-5">
          Войдите, чтобы видеть свои курсы, покупки и полный профиль
        </p>

        {/* Tab switch */}
        <div className="flex gap-1 mb-5 bg-white/[0.03] rounded-lg p-1 border border-white/[0.06]">
          <button
            type="button"
            onClick={() => { setTab("login"); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-display font-bold uppercase tracking-wider transition-all ${
              tab === "login"
                ? "bg-white/[0.08] text-neon-cyan border border-neon-cyan/20"
                : "text-foreground/40 hover:text-foreground/60"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Вход
          </button>
          <button
            type="button"
            onClick={() => { setTab("register"); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-display font-bold uppercase tracking-wider transition-all ${
              tab === "register"
                ? "bg-white/[0.08] text-neon-magenta border border-neon-magenta/20"
                : "text-foreground/40 hover:text-foreground/60"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Регистрация
          </button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-xs"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === "register" && (
            <>
              <FormInput
                label="Имя"
                icon={User}
                value={regName}
                onChange={setRegName}
                placeholder="Ваше имя"
              />
              <FormInput
                label="Телефон"
                icon={Phone}
                type="tel"
                value={regPhone}
                onChange={setRegPhone}
                placeholder="+7 (___) ___-__-__"
              />
            </>
          )}
          <FormInput
            label="Email"
            icon={Mail}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="email@example.com"
          />
          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground/45 mb-1">
              <LogIn className="w-3 h-3" /> Пароль
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tab === "register" ? "Минимум 6 символов" : "Ваш пароль"}
                required
                minLength={6}
                className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-sm focus:outline-none focus:border-neon-cyan/40 focus:bg-white/[0.05] focus:shadow-[0_0_20px_hsl(180_100%_50%/0.08)] transition-all placeholder:text-foreground/20 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading || !email || !password}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-display font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              tab === "login"
                ? "bg-gradient-to-r from-neon-cyan/20 to-neon-cyan/5 border border-neon-cyan/30 text-neon-cyan hover:from-neon-cyan/25 hover:to-neon-cyan/10 hover:border-neon-cyan/50 hover:shadow-[0_0_25px_rgba(0,255,255,0.15)]"
                : "bg-gradient-to-r from-neon-magenta/20 to-neon-magenta/5 border border-neon-magenta/30 text-neon-magenta hover:from-neon-magenta/25 hover:to-neon-magenta/10 hover:border-neon-magenta/50 hover:shadow-[0_0_25px_rgba(255,0,255,0.15)]"
            }`}
          >
            {loading
              ? "Подождите..."
              : tab === "login"
              ? "Войти"
              : "Зарегистрироваться"}
          </motion.button>
        </form>
      </div>
    </Card>
  );
}

/* ── Purchase status badge ── */
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
    refunded: "bg-red-500/15 text-red-400 border-red-500/25",
  };
  const labels: Record<string, string> = {
    paid: "Оплачено",
    pending: "Ожидает",
    refunded: "Возврат",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colors[status] || colors.pending}`}>
      {labels[status] || status}
    </span>
  );
}

export default function ProfilePage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const profile = useUserProfile();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setPhone(profile.phone);
  }, [profile.name, profile.email, profile.phone]);

  const grad = useMemo(() => avatarGradient(profile.name || name), [profile.name, name]);

  const handleSave = async () => {
    setSaving(true);
    const hadNoName = !profile.name.trim();
    const newName = name.trim();
    await profile.save({ name: newName, email: email.trim(), phone: phone.trim() });
    if (hadNoName && newName && !profile.isGreetingShown) {
      setShowGreeting(true);
      profile.markGreetingShown();
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const hasChanges = name !== profile.name || email !== profile.email || phone !== profile.phone;
  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : "?";

  /* ── Data for "my downloads" ── */
  const { data: checklists = [] } = useQuery({
    queryKey: ["checklists"],
    queryFn: () => api.checklists.list(),
    staleTime: 5 * 60_000,
  });
  const { data: reports = [] } = useQuery({
    queryKey: ["research-reports"],
    queryFn: () => api.research.reports(),
    staleTime: 5 * 60_000,
  });

  /* ── Purchases (only when authenticated) ── */
  const { data: purchases = [] } = useQuery<Purchase[]>({
    queryKey: ["my-purchases"],
    queryFn: () => api.purchases.my(),
    staleTime: 60_000,
    enabled: profile.isAuthenticated,
  });

  const handleLogin = async (data: { email: string; password: string }) => {
    await profile.login(data);
  };

  const handleRegister = async (data: { email: string; password: string; name?: string; phone?: string }) => {
    await profile.register(data);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingCubes />
      <Navbar />
      <GreetingOverlay name={name.trim()} show={showGreeting} onDone={() => setShowGreeting(false)} />

      {/* BANNER */}
      <div className="relative pt-24">
        <div className="h-40 md:h-48 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: grad.bg }} />
          <div className="absolute inset-0" style={{ background: grad.radial }} />
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        </div>

        <div className="container max-w-6xl relative">
          <div className="flex items-end gap-5 -mt-16 md:-mt-20 mb-6">
            <motion.div
              animate={{
                boxShadow: [
                  `0 0 25px hsla(${grad.hue1}, 80%, 50%, 0.25)`,
                  `0 0 45px hsla(${grad.hue1}, 80%, 50%, 0.4)`,
                  `0 0 25px hsla(${grad.hue1}, 80%, 50%, 0.25)`,
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden ring-4 ring-background flex-shrink-0"
            >
              <div className="absolute inset-0" style={{ background: grad.bg }} />
              <div className="absolute inset-0" style={{ background: grad.radial }} />
              <div className="absolute inset-0 opacity-[0.12]" style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                backgroundSize: "10px 10px",
              }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-4xl md:text-5xl font-black text-white/90 drop-shadow-lg">
                  {initial}
                </span>
              </div>
              <div className="absolute inset-0 rounded-2xl border border-white/20" />
            </motion.div>

            <div className="pb-1 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  {profile.name && (
                    <p className="text-[10px] uppercase tracking-[0.25em] text-neon-cyan/50 font-bold mb-0.5">
                      {profile.greeting}
                    </p>
                  )}
                  <h1 className="font-display text-2xl md:text-3xl font-black text-white">
                    {profile.name || "Ваш профиль"}
                  </h1>
                </div>
                {profile.isAuthenticated && (
                  <button
                    onClick={profile.logout}
                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-foreground/40 hover:text-red-400 border border-white/[0.06] hover:border-red-500/25 transition-all"
                  >
                    <LogOut className="w-3 h-3" />
                    Выйти
                  </button>
                )}
              </div>
              {profile.isAuthenticated && profile.authUser && (
                <p className="text-xs text-foreground/35 mt-0.5">{profile.authUser.email}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <section className="relative z-10 pb-20">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-5">

            {/* LEFT COLUMN (3/5) */}
            <div className="lg:col-span-3 space-y-5">

              {/* Auth card — show when NOT authenticated */}
              {!profile.isAuthenticated && profile.authChecked && (
                <AuthCard
                  onLogin={handleLogin}
                  onRegister={handleRegister}
                  delay={0}
                />
              )}

              {/* Profile form */}
              <Card delay={profile.isAuthenticated ? 0.05 : 0.1}>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-neon-cyan/40 via-neon-cyan/15 to-transparent" />
                <div className="p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-4 h-4 text-neon-cyan" />
                    <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">Личные данные</h2>
                    {profile.isAuthenticated && (
                      <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" />
                        Аккаунт
                      </span>
                    )}
                  </div>
                  <p className="text-foreground/35 text-xs mb-4">
                    {profile.isAuthenticated
                      ? "Данные синхронизированы с вашим аккаунтом"
                      : "Подтягиваются в формы конференции, книги и исследований"}
                  </p>

                  <div className="space-y-3">
                    <FormInput
                      label="Имя"
                      icon={User}
                      value={name}
                      onChange={setName}
                      placeholder="Как вас зовут?"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FormInput
                        label="Email"
                        icon={Mail}
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="email@example.com"
                        disabled={profile.isAuthenticated}
                      />
                      <FormInput
                        label="Телефон"
                        icon={Phone}
                        type="tel"
                        value={phone}
                        onChange={setPhone}
                        placeholder="+7 (___) ___-__-__"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <motion.button
                      onClick={handleSave}
                      disabled={saving || !hasChanges}
                      whileHover={hasChanges ? { scale: 1.03 } : {}}
                      whileTap={hasChanges ? { scale: 0.97 } : {}}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-display font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-neon-cyan/15 to-neon-cyan/5 border border-neon-cyan/25 text-neon-cyan hover:from-neon-cyan/20 hover:to-neon-cyan/10 hover:border-neon-cyan/40 hover:shadow-[0_0_25px_rgba(0,255,255,0.12)]"
                    >
                      {saved ? <><CheckCircle2 className="w-3.5 h-3.5" /> Сохранено</> : saving ? "Сохраняю..." : <><Save className="w-3.5 h-3.5" /> Сохранить</>}
                    </motion.button>
                    <span className="text-[10px] text-foreground/25">Не передаётся третьим лицам</span>
                  </div>
                </div>
              </Card>

              {/* My courses — only when authenticated */}
              {profile.isAuthenticated && (
                <Card delay={0.1}>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-neon-cyan/40 via-neon-cyan/15 to-transparent" />
                  <div className="p-5 md:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ShoppingBag className="w-4 h-4 text-neon-cyan" />
                      <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">Мои курсы</h2>
                    </div>

                    {purchases.length === 0 ? (
                      <div className="text-center py-8">
                        <GraduationCap className="w-8 h-8 mx-auto mb-3 text-foreground/15" />
                        <p className="text-foreground/35 text-sm mb-1">У вас пока нет курсов</p>
                        <p className="text-foreground/25 text-xs mb-4">Загляните в Академию за знаниями</p>
                        <Link
                          to="/academy"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-display font-bold uppercase tracking-wider bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/15 hover:border-neon-cyan/30 transition-all"
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          Перейти в Академию
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {purchases.map((p) => (
                          <Link
                            key={p.id}
                            to={p.status === "paid" && p.course_slug ? `/learn/${p.course_slug}` : `/courses/${p.course_slug}`}
                            className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-neon-cyan/25 hover:bg-white/[0.04] transition-all"
                          >
                            <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
                              <GraduationCap className="w-4 h-4 text-neon-cyan" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-display text-xs font-bold text-white truncate">
                                {p.course_title || "Курс"}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <StatusBadge status={p.status} />
                                {p.amount > 0 && (
                                  <span className="text-[10px] text-foreground/30">
                                    {p.amount.toLocaleString("ru-RU")} &#8381;
                                  </span>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-neon-cyan transition-colors flex-shrink-0" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* My downloads */}
              <Card delay={profile.isAuthenticated ? 0.15 : 0.2}>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-neon-magenta/40 via-neon-magenta/15 to-transparent" />
                <div className="p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Download className="w-4 h-4 text-neon-magenta" />
                    <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">Материалы</h2>
                  </div>

                  <div className="space-y-2">
                    {/* Book — always available */}
                    <Link
                      to="/book"
                      className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-neon-cyan/25 hover:bg-white/[0.04] transition-all"
                    >
                      <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-neon-cyan" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-xs font-bold text-white">Банкротство физических лиц</div>
                        <div className="text-[10px] text-foreground/35">Практическое руководство · PDF</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-neon-cyan transition-colors flex-shrink-0" />
                    </Link>

                    {/* Checklists */}
                    {checklists.slice(0, 3).map((c: any) => (
                      <Link
                        key={c.id}
                        to="/checklists"
                        className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-neon-magenta/25 hover:bg-white/[0.04] transition-all"
                      >
                        <div className="w-9 h-9 rounded-lg bg-neon-magenta/10 flex items-center justify-center flex-shrink-0">
                          <FileCheck className="w-4 h-4 text-neon-magenta" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-display text-xs font-bold text-white truncate">{c.title}</div>
                          <div className="text-[10px] text-foreground/35">Чек-лист · PDF</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-neon-magenta transition-colors flex-shrink-0" />
                      </Link>
                    ))}

                    {/* Research reports */}
                    {reports.slice(0, 3).map((r: any) => (
                      <Link
                        key={r.id}
                        to="/research"
                        className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-neon-cyan/25 hover:bg-white/[0.04] transition-all"
                      >
                        <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
                          <BarChart3 className="w-4 h-4 text-neon-cyan" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-display text-xs font-bold text-white truncate">{r.title}</div>
                          <div className="text-[10px] text-foreground/35">Исследование · PDF</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-neon-cyan transition-colors flex-shrink-0" />
                      </Link>
                    ))}

                    {checklists.length === 0 && reports.length === 0 && (
                      <div className="text-center py-6 text-foreground/25 text-xs">
                        <Sparkles className="w-5 h-5 mx-auto mb-2 text-foreground/15" />
                        Материалы появятся здесь
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN (2/5) */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Logout button (mobile) */}
              {profile.isAuthenticated && (
                <div className="lg:hidden">
                  <button
                    onClick={profile.logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-foreground/40 hover:text-red-400 border border-white/[0.06] hover:border-red-500/25 bg-white/[0.02] transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Выйти из аккаунта
                  </button>
                </div>
              )}

              {/* NeuroPravo bot */}
              <Card delay={0.1}>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-neon-magenta/40 via-neon-magenta/15 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,0,255,0.06),transparent_50%)]" />

                <div className="relative p-5 md:p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <motion.div
                      animate={{ boxShadow: ["0 0 15px rgba(255,0,255,0.1)", "0 0 30px rgba(255,0,255,0.2)", "0 0 15px rgba(255,0,255,0.1)"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-neon-magenta/15 to-neon-cyan/10 border border-neon-magenta/25 flex items-center justify-center"
                    >
                      <Bot className="w-6 h-6 text-neon-magenta" />
                    </motion.div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-neon-magenta mb-0.5">
                        Telegram-бот
                      </p>
                      <h3 className="font-display text-lg font-black text-white leading-tight">
                        NeuroPravo
                      </h3>
                    </div>
                  </div>

                  <p className="text-foreground/55 text-sm leading-relaxed mb-5">
                    Все материалы платформы — в одном боте. Книга, чек-листы, исследования
                    и курсы Академии прямо в Telegram.
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-5">
                    {[
                      { icon: BookOpen, text: "Книга по банкротству физлиц", accent: "magenta" },
                      { icon: FileCheck, text: "Чек-листы для практики", accent: "cyan" },
                      { icon: BarChart3, text: "Аналитические исследования", accent: "magenta" },
                      { icon: GraduationCap, text: "Каталог курсов Академии", accent: "cyan" },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          f.accent === "magenta" ? "bg-neon-magenta/10" : "bg-neon-cyan/10"
                        }`}>
                          <f.icon className={`w-3.5 h-3.5 ${
                            f.accent === "magenta" ? "text-neon-magenta" : "text-neon-cyan"
                          }`} />
                        </div>
                        <span className="text-xs text-foreground/50">{f.text}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="https://t.me/NeuroPravo_Bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-neon-magenta to-neon-magenta/80 text-white font-display font-bold rounded-lg shadow-lg shadow-neon-magenta/20 hover:shadow-neon-magenta/35 hover:scale-[1.02] transition-all text-sm uppercase tracking-wider"
                  >
                    Открыть бота
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </Card>

              {/* Quick links */}
              <Card delay={0.2} className="flex-1">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-neon-cyan/30 via-neon-cyan/10 to-transparent" />
                <div className="p-5 md:p-6 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <ExternalLink className="w-4 h-4 text-neon-cyan" />
                    <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">Разделы</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-2 flex-1 auto-rows-fr">
                    {[
                      { to: "/conference", label: "Конференция", Icon: Mic2, accent: "magenta" as const },
                      { to: "/academy", label: "Академия", Icon: GraduationCap, accent: "cyan" as const },
                      { to: "/research", label: "Исследования", Icon: BarChart3, accent: "cyan" as const },
                      { to: "/book", label: "Книга", Icon: BookOpen, accent: "magenta" as const },
                      { to: "/checklists", label: "Чек-листы", Icon: FileCheck, accent: "magenta" as const },
                      { to: "/platform", label: "Платформа", Icon: Layers, accent: "cyan" as const },
                    ].map((l) => (
                      <Link
                        key={l.to}
                        to={l.to}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-neon-cyan/20 hover:bg-white/[0.04] transition-all text-xs text-foreground/50 hover:text-white"
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          l.accent === "magenta" ? "bg-neon-magenta/10" : "bg-neon-cyan/10"
                        }`}>
                          <l.Icon className={`w-3.5 h-3.5 ${
                            l.accent === "magenta" ? "text-neon-magenta" : "text-neon-cyan"
                          }`} />
                        </div>
                        <span className="font-medium">{l.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
