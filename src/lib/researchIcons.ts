import {
  FileText,
  TrendingUp,
  Brain,
  Users,
  BarChart3,
  Cpu,
  FileStack,
  MessageSquare,
  Landmark,
  Castle,
  Megaphone,
  AlertOctagon,
  Briefcase,
  Map,
  FileSearch,
  Building2,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  FileText,
  TrendingUp,
  Brain,
  Users,
  BarChart3,
  Cpu,
  FileStack,
  MessageSquare,
  Landmark,
  Castle,
  Megaphone,
  AlertOctagon,
  Briefcase,
  Map,
  FileSearch,
  Building2,
};

export const resolveResearchIcon = (name?: string): LucideIcon =>
  (name && ICONS[name]) || FileText;
