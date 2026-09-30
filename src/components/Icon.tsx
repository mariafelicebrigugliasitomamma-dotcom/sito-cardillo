import { createElement } from "react";
import type { LucideProps } from "lucide-react";
import { resolveIcon } from "@/lib/icons";

type IconProps = LucideProps & { name: string };

export default function Icon({ name, ...props }: IconProps) {
  return createElement(resolveIcon(name), props);
}
