import {
  Scale,
  Building2,
  Landmark,
  FileSignature,
  Handshake,
  Home,
  Briefcase,
  ShieldAlert,
  Gavel,
  Users,
  BookOpen,
  Globe,
  ShieldCheck,
  Microscope,
  Crown,
  Smile,
  Gem,
  Sparkles,
  HeartPulse,
  Baby,
  Syringe,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Scale,
  Building2,
  Landmark,
  FileSignature,
  Handshake,
  Home,
  Briefcase,
  ShieldAlert,
  Gavel,
  Users,
  BookOpen,
  Globe,
  ShieldCheck,
  Microscope,
  Crown,
  Smile,
  Gem,
  Sparkles,
  HeartPulse,
  Baby,
  Syringe,
  Stethoscope,
};

export const iconNames = Object.keys(iconMap);

export function resolveIcon(name: string): LucideIcon {
  return iconMap[name] ?? Smile;
}
