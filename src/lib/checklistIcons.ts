import {
  ClipboardList,
  ClipboardCheck,
  FileCheck,
  Handshake,
  ShieldCheck,
  Scale,
  Gavel,
  ListChecks,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  ClipboardList,
  ClipboardCheck,
  FileCheck,
  Handshake,
  ShieldCheck,
  Scale,
  Gavel,
  ListChecks,
};

export const resolveChecklistIcon = (name?: string): LucideIcon =>
  (name && ICONS[name]) || ClipboardList;
