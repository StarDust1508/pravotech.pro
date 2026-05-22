import {
  FileText,
  TrendingUp,
  Brain,
  Users,
  BarChart3,
  Cpu,
  FileStack,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

// Сопоставление имён иконок (хранятся в БД как строка) с компонентами lucide.
// Используется и в секции, и на странице отчёта, чтобы данные оставались
// сериализуемыми (в БД лежит имя, а не сам компонент).
const ICONS: Record<string, LucideIcon> = {
  FileText,
  TrendingUp,
  Brain,
  Users,
  BarChart3,
  Cpu,
  FileStack,
  MessageSquare,
};

export const resolveResearchIcon = (name?: string): LucideIcon =>
  (name && ICONS[name]) || FileText;
