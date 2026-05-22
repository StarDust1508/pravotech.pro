import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api, User } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import LessonPanel from '@/components/LessonPanel';
import { LogIn, UserPlus, ArrowLeft, GraduationCap } from 'lucide-react';

export default function LearnPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [courseId, setCourseId] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth tab state for login/register prompt
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '', phone: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      setAuthChecked(true);
      setLoading(false);
      return;
    }
    api.userAuth
      .me()
      .then((u) => {
        setUser(u);
      })
      .catch(() => {
        localStorage.removeItem('user_token');
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, []);

  // Resolve slug to courseId
  useEffect(() => {
    if (!slug) return;
    const resolve = async () => {
      try {
        setLoading(true);
        const course = await api.academy.course(slug);
        setCourseId(course.id);
        setCourseTitle(course.title);
        document.title = `${course.title} | Обучение`;
      } catch {
        setError('Курс не найден');
      } finally {
        setLoading(false);
      }
    };
    resolve();
  }, [slug]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (authTab === 'register') {
        const result = await api.userAuth.register({
          email: authForm.email,
          password: authForm.password,
          name: authForm.name || undefined,
          phone: authForm.phone || undefined,
        });
        localStorage.setItem('user_token', result.token);
        setUser(result.user);
      } else {
        const result = await api.userAuth.login({
          email: authForm.email,
          password: authForm.password,
        });
        localStorage.setItem('user_token', result.token);
        setUser(result.user);
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Ошибка авторизации');
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !courseId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="text-xl text-muted-foreground">{error || 'Курс не найден'}</p>
          <Link to={`/courses/${slug}`} className="text-neon-cyan hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Вернуться к описанию курса
          </Link>
        </div>
      </div>
    );
  }

  // Not authenticated — show login/register prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-md py-20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-neon-cyan" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">{courseTitle}</h1>
            <p className="text-muted-foreground text-sm">
              Войдите или зарегистрируйтесь, чтобы получить доступ к урокам
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            {/* Tab buttons */}
            <div className="flex gap-1 mb-6 bg-muted/50 rounded-lg p-1">
              <button
                onClick={() => { setAuthTab('login'); setAuthError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all
                  ${authTab === 'login' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LogIn className="w-4 h-4" />
                Вход
              </button>
              <button
                onClick={() => { setAuthTab('register'); setAuthError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all
                  ${authTab === 'register' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <UserPlus className="w-4 h-4" />
                Регистрация
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {authTab === 'register' && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Имя</label>
                    <input
                      type="text"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Телефон</label>
                    <input
                      type="tel"
                      value={authForm.phone}
                      onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Email <span className="text-neon-magenta">*</span>
                </label>
                <input
                  required
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Пароль <span className="text-neon-magenta">*</span>
                </label>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                  placeholder={authTab === 'register' ? 'Минимум 6 символов' : 'Ваш пароль'}
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full px-6 py-3 bg-neon-cyan text-primary-foreground font-display font-bold rounded-lg
                           hover:opacity-90 transition-opacity text-sm uppercase tracking-wider disabled:opacity-50"
              >
                {authLoading
                  ? 'Подождите...'
                  : authTab === 'login'
                  ? 'Войти'
                  : 'Зарегистрироваться'}
              </button>
            </form>
          </div>

          <div className="text-center mt-6">
            <Link
              to={`/courses/${slug}`}
              className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Вернуться к описанию курса
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated — render lesson panel
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/academy" className="hover:text-neon-cyan transition-colors">
            Академия
          </Link>
          <span>/</span>
          <Link to={`/courses/${slug}`} className="hover:text-neon-cyan transition-colors">
            {courseTitle}
          </Link>
          <span>/</span>
          <span className="text-foreground">Обучение</span>
        </div>

        <LessonPanel courseId={courseId} />
      </div>
    </div>
  );
}
