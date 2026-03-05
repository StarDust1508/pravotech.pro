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

export interface Media {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface LeadStats {
  exhibition: number;
  speakers: number;
  sponsors: number;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
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

  leads: {
    exhibition: () => request<ExhibitionLead[]>('/leads/exhibition'),
    speakers: () => request<SpeakerLead[]>('/leads/speakers'),
    sponsors: () => request<SponsorLead[]>('/leads/sponsors'),
    stats: () => request<LeadStats>('/leads/stats'),
    submitExhibition: (data: Partial<ExhibitionLead>) =>
      request<ExhibitionLead>('/leads/exhibition', { method: 'POST', body: JSON.stringify(data) }),
    submitSpeaker: (data: Partial<SpeakerLead>) =>
      request<SpeakerLead>('/leads/speakers', { method: 'POST', body: JSON.stringify(data) }),
    submitSponsor: (data: Partial<SponsorLead>) =>
      request<SponsorLead>('/leads/sponsors', { method: 'POST', body: JSON.stringify(data) }),
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
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    },
    delete: (id: string) =>
      request<{ success: boolean }>(`/media/${id}`, { method: 'DELETE' }),
  },
};
