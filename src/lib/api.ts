export interface Speaker {
  id: string;
  full_name: string;
  position: string;
  company: string;
  bio: string;
  photo_url: string;
  stream: string;
  talk_title: string;
  talk_description: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Stream {
  id: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
  is_highlighted: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Sponsor {
  id: string;
  company_name: string;
  logo_url: string;
  website_url: string;
  tier: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SponsorTier {
  id: string;
  name: string;
  price: string;
  icon: string;
  display_order: number;
  perks: string[];
}

export interface ExhibitionLead {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  stand_size: string;
  notes: string;
  created_at: string;
}

export interface SpeakerLead {
  id: string;
  full_name: string;
  position: string;
  company: string;
  email: string;
  stream: string;
  talk_title: string;
  talk_description: string;
  created_at: string;
}

export interface SponsorLead {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  tier: string;
  notes: string;
  created_at: string;
}

export interface TicketLead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  ticket_type: string;
  ticket_price: string;
  payment_method: string;
  created_at: string;
}

export interface Participant {
  id: string;
  company_name: string;
  logo_url: string;
  website_url: string;
  industry: string;
  description: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface AcademyCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_highlights?: string[];
  price: string;
  level: string;
  display_order: number;
  is_published: boolean;
  target_audience: string[];
  lessons: { title: string; points: string[] }[];
  selling_points: string[];
  faq_items: { question: string; answer: string }[];
  team_order: string[];
  learning_results: string[];
  program_features: string[];
  materials_includes: string[];
  practice_tasks: string[];
  program_badge: string;
  program_format_title: string;
  program_format_description: string;
  special_offer_title: string;
  special_offer_description: string;
  special_offer_badge: string;
  special_offer_button_text: string;
  cta_title: string;
  cta_description: string;
  cta_button_text: string;
  intro_title: string;
  intro_description: string;
  download_form_banner_url: string;
  download_form_file_url: string;
  download_form_title: string;
  download_form_description: string;
  cover_image_url: string;
}

export interface AcademyTeacher {
  id: string;
  full_name: string;
  position: string;
  bio: string;
  expertise: string;
  experience: string;
  photo_url: string;
  display_order: number;
  is_published: boolean;
}

export interface AcademyReview {
  id: string;
  course_id: string;
  rating: number;
  comment: string;
  author_name: string;
  author_avatar_url: string;
  review_image_url: string;
  review_video_url: string;
  is_published: boolean;
  created_at: string;
}

export interface ResearchReport {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  accent: string;
  summary: string;
  cover_image_url: string;
  pdf_url: string;
  pdf_media_id: string | null;
  charts: ResearchChart[] | null;
  is_free: boolean;
  price: number | null;
  rating: number | null;
  rating_count: number | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResearchChart {
  type: "bar" | "barh" | "line" | "pie" | "steps";
  title: string;
  unit?: string;
  note?: string;
  data: { label: string; value?: number }[];
}

export interface TelegramPost {
  id: number;
  link: string;
  text: string;
  date: string;
  photo: string | null;
}

export interface ChecklistPoint {
  text: string;
  hint?: string;
}

export interface ChecklistGroup {
  group: string;
  points: ChecklistPoint[];
}

export interface Checklist {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  accent: string;
  intro: string;
  items: ChecklistGroup[] | null;
  pdf_url: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// ─── User / Lesson types ─────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: string;
  created_at?: string;
}

export interface Lesson {
  id: number;
  course_id: string;
  title: string;
  description: string;
  duration_minutes: number;
  display_order: number;
  is_free: boolean;
  has_test: boolean;
  accessible: boolean;
  video_token?: string | null;
  presentation_url?: string | null;
  test_data?: {
    questions: {
      question: string;
      options: string[];
      correct: number;
    }[];
  } | null;
  progress?: LessonProgress | null;
}

export interface LessonProgress {
  completed: boolean;
  test_score: number | null;
  test_answers: unknown[] | null;
  watched_seconds: number;
}

export interface Purchase {
  id: number;
  user_id: number;
  course_id: string;
  status: 'pending' | 'paid' | 'refunded';
  amount: number;
  created_at: string;
  course_title?: string;
  course_slug?: string;
}

export interface TestResult {
  score: number;
  total: number;
  correct: number;
  results: {
    question_index: number;
    user_answer: number;
    correct_answer: number;
    is_correct: boolean;
  }[];
}

export interface ResearchLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  telegram: string;
  company: string;
  position: string;
  research_id: string;
  research_title: string;
  source_form: string;
  delivery_channel: string;
  created_at: string;
}

export interface LeadStats {
  exhibition: number;
  speakers: number;
  sponsors: number;
  tickets: number;
  research: number;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getUserAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('user_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function userRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...getUserAuthHeaders(), ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    login: (password: string) =>
      request<{ token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ password }) }),
    verify: () =>
      request<{ valid: boolean }>('/auth/verify'),
    logout: () =>
      request<{ success: boolean }>('/auth/logout', { method: 'POST' }),
  },

  speakers: {
    list: (published?: boolean) =>
      request<Speaker[]>(`/speakers${published !== undefined ? `?published=${published}` : ''}`),
    get: (id: string) => request<Speaker>(`/speakers/${id}`),
    create: (data: Partial<Speaker>) =>
      request<Speaker>('/speakers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Speaker>) =>
      request<Speaker>(`/speakers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    togglePublish: (id: string, is_published: boolean) =>
      request<Speaker>(`/speakers/${id}/publish`, { method: 'PATCH', body: JSON.stringify({ is_published }) }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/speakers/${id}`, { method: 'DELETE' }),
  },

  streams: {
    list: (published?: boolean) =>
      request<Stream[]>(`/streams${published !== undefined ? `?published=${published}` : ''}`),
    create: (data: Partial<Stream>) =>
      request<Stream>('/streams', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Stream>) =>
      request<Stream>(`/streams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/streams/${id}`, { method: 'DELETE' }),
  },

  sponsors: {
    list: (published?: boolean) =>
      request<Sponsor[]>(`/sponsors${published !== undefined ? `?published=${published}` : ''}`),
    create: (data: Partial<Sponsor>) =>
      request<Sponsor>('/sponsors', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Sponsor>) =>
      request<Sponsor>(`/sponsors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/sponsors/${id}`, { method: 'DELETE' }),
    tiers: () => request<SponsorTier[]>('/sponsors/tiers'),
    updateTier: (id: string, data: Partial<SponsorTier & { perks: string[] }>) =>
      request<SponsorTier>(`/sponsors/tiers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  participants: {
    list: (published?: boolean) =>
      request<Participant[]>(`/participants${published !== undefined ? `?published=${published}` : ''}`),
    get: (id: string) => request<Participant>(`/participants/${id}`),
    create: (data: Partial<Participant>) =>
      request<Participant>('/participants', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Participant>) =>
      request<Participant>(`/participants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    togglePublish: (id: string, is_published: boolean) =>
      request<Participant>(`/participants/${id}/publish`, { method: 'PATCH', body: JSON.stringify({ is_published }) }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/participants/${id}`, { method: 'DELETE' }),
  },

  leads: {
    exhibition: () => request<ExhibitionLead[]>('/leads/exhibition'),
    speakers: () => request<SpeakerLead[]>('/leads/speakers'),
    sponsors: () => request<SponsorLead[]>('/leads/sponsors'),
    tickets: () => request<TicketLead[]>('/leads/tickets'),
    stats: () => request<LeadStats>('/leads/stats'),
    submitExhibition: (data: Partial<ExhibitionLead>) =>
      request<ExhibitionLead>('/leads/exhibition', { method: 'POST', body: JSON.stringify(data) }),
    submitSpeaker: (data: Partial<SpeakerLead>) =>
      request<SpeakerLead>('/leads/speakers', { method: 'POST', body: JSON.stringify(data) }),
    submitSponsor: (data: Partial<SponsorLead>) =>
      request<SponsorLead>('/leads/sponsors', { method: 'POST', body: JSON.stringify(data) }),
    submitTicket: (data: Partial<TicketLead>) =>
      request<TicketLead>('/leads/tickets', { method: 'POST', body: JSON.stringify(data) }),
    research: () => request<ResearchLead[]>('/leads/research'),
    submitResearch: (data: Partial<ResearchLead>) =>
      request<ResearchLead>('/leads/research', { method: 'POST', body: JSON.stringify(data) }),
  },

  settings: {
    list: () => request<Record<string, string>>('/settings'),
    update: (key: string, value: string) =>
      request('/settings/' + encodeURIComponent(key), { method: 'PUT', body: JSON.stringify({ value }) }),
  },

  media: {
    list: () => request<Media[]>('/media'),
    upload: async (file: File): Promise<Media> => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/media/upload`, {
        method: 'POST',
        headers: { ...getAuthHeaders() },
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    },
    uploadToPath: async (file: File): Promise<{ publicUrl: string; filename: string }> => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/media/upload-to-path`, {
        method: 'POST',
        headers: { ...getAuthHeaders() },
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    },
    delete: (id: string) =>
      request<{ success: boolean }>(`/media/${id}`, { method: 'DELETE' }),
  },

  academy: {
    courses: (all?: boolean) => request<AcademyCourse[]>(`/academy/courses${all ? '?all=true' : ''}`),
    course: (slug: string) => request<AcademyCourse>(`/academy/courses/${slug}`),
    createCourse: (data: Partial<AcademyCourse>) =>
      request<AcademyCourse>('/academy/courses', { method: 'POST', body: JSON.stringify(data) }),
    updateCourse: (id: string, data: Partial<AcademyCourse>) =>
      request<AcademyCourse>(`/academy/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCourse: (id: string) =>
      request<{ success: boolean }>(`/academy/courses/${id}`, { method: 'DELETE' }),
    toggleCoursePublish: (id: string, is_published: boolean) =>
      request<AcademyCourse>(`/academy/courses/${id}/publish`, { method: 'PATCH', body: JSON.stringify({ is_published }) }),

    teachers: (all?: boolean) => request<AcademyTeacher[]>(`/academy/teachers${all ? '?all=true' : ''}`),
    createTeacher: (data: Partial<AcademyTeacher>) =>
      request<AcademyTeacher>('/academy/teachers', { method: 'POST', body: JSON.stringify(data) }),
    updateTeacher: (id: string, data: Partial<AcademyTeacher>) =>
      request<AcademyTeacher>(`/academy/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTeacher: (id: string) =>
      request<{ success: boolean }>(`/academy/teachers/${id}`, { method: 'DELETE' }),
    toggleTeacherPublish: (id: string, is_published: boolean) =>
      request<AcademyTeacher>(`/academy/teachers/${id}/publish`, { method: 'PATCH', body: JSON.stringify({ is_published }) }),

    reviews: (courseId?: string, all?: boolean) => {
      const params = new URLSearchParams();
      if (courseId) params.set('course_id', courseId);
      if (all) params.set('all', 'true');
      const qs = params.toString();
      return request<AcademyReview[]>(`/academy/reviews${qs ? '?' + qs : ''}`);
    },
    createReview: (data: Partial<AcademyReview>) =>
      request<AcademyReview>('/academy/reviews', { method: 'POST', body: JSON.stringify(data) }),
    updateReview: (id: string, data: Partial<AcademyReview>) =>
      request<AcademyReview>(`/academy/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteReview: (id: string) =>
      request<{ success: boolean }>(`/academy/reviews/${id}`, { method: 'DELETE' }),
    toggleReviewPublish: (id: string, is_published: boolean) =>
      request<AcademyReview>(`/academy/reviews/${id}/publish`, { method: 'PATCH', body: JSON.stringify({ is_published }) }),

    register: (data: { name: string; phone: string; email: string; course_id?: string; course_title?: string }) =>
      request('/academy/register', { method: 'POST', body: JSON.stringify(data) }),
  },

  research: {
    reports: (all?: boolean) => request<ResearchReport[]>(`/research/reports${all ? '?all=true' : ''}`),
    report: (slug: string) => request<ResearchReport>(`/research/reports/${slug}`),
    createReport: (data: Partial<ResearchReport>) =>
      request<ResearchReport>('/research/reports', { method: 'POST', body: JSON.stringify(data) }),
    updateReport: (id: string, data: Partial<ResearchReport>) =>
      request<ResearchReport>(`/research/reports/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteReport: (id: string) =>
      request<{ success: boolean }>(`/research/reports/${id}`, { method: 'DELETE' }),
    toggleReportPublish: (id: string, is_published: boolean) =>
      request<ResearchReport>(`/research/reports/${id}/publish`, { method: 'PATCH', body: JSON.stringify({ is_published }) }),
  },

  telegram: {
    feed: (channel?: string, limit = 4) => {
      const params = new URLSearchParams();
      if (channel) params.set('channel', channel);
      params.set('limit', String(limit));
      return request<{ channel: string; posts: TelegramPost[]; error?: string }>(`/telegram/feed?${params.toString()}`);
    },
  },

  checklists: {
    list: (all?: boolean) => request<Checklist[]>(`/checklists${all ? '?all=true' : ''}`),
    get: (slug: string) => request<Checklist>(`/checklists/${slug}`),
    create: (data: Partial<Checklist>) =>
      request<Checklist>('/checklists', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Checklist>) =>
      request<Checklist>(`/checklists/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/checklists/${id}`, { method: 'DELETE' }),
    togglePublish: (id: string, is_published: boolean) =>
      request<Checklist>(`/checklists/${id}/publish`, { method: 'PATCH', body: JSON.stringify({ is_published }) }),
  },

  userAuth: {
    register: (data: { email: string; password: string; name?: string; phone?: string }) =>
      userRequest<{ token: string; user: User }>('/user-auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    login: (data: { email: string; password: string }) =>
      userRequest<{ token: string; user: User }>('/user-auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    me: () => userRequest<User>('/user-auth/me'),
    updateMe: (data: { name: string; phone: string }) =>
      userRequest<User>('/user-auth/me', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    linkDevice: (device_id: string) =>
      userRequest<{ ok: boolean }>('/user-auth/link-device', {
        method: 'POST',
        body: JSON.stringify({ device_id }),
      }),
  },

  lessons: {
    list: (courseId: string) =>
      userRequest<Lesson[]>(`/lessons/courses/${courseId}/lessons`),
    get: (id: number) =>
      userRequest<Lesson>(`/lessons/${id}`),
    progress: (id: number, data: { watched_seconds?: number; completed?: boolean }) =>
      userRequest<LessonProgress>(`/lessons/${id}/progress`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    submitTest: (id: number, answers: number[]) =>
      userRequest<TestResult>(`/lessons/${id}/test`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      }),
  },

  purchases: {
    create: (courseId: string) =>
      userRequest<Purchase>('/purchases', {
        method: 'POST',
        body: JSON.stringify({ courseId }),
      }),
    my: () => userRequest<Purchase[]>('/purchases/my'),
    confirm: (id: number) =>
      userRequest<Purchase>(`/purchases/${id}/confirm`, { method: 'POST' }),
  },

  payments: {
    create: (courseId: string) =>
      userRequest<{ confirmationUrl: string; paymentId: string }>('/payments/create', {
        method: 'POST',
        body: JSON.stringify({ courseId }),
      }),
    status: (purchaseId: number) =>
      userRequest<{ status: string; paymentId: string | null }>(`/payments/status/${purchaseId}`),
  },

  video: {
    getStreamUrl: (token: string) => `${API_URL}/video/${token}`,
  },
};
