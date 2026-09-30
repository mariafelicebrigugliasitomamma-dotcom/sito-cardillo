"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { HeaderUiContent } from "@/lib/types";

function navFromUi(ui: HeaderUiContent) {
  return [
    { href: "/", label: ui.navHome },
    { href: "/studio", label: ui.navStudio },
    { href: "/professionisti", label: ui.navTeam },
    { href: "/servizi", label: ui.navAree },
    { href: "/contatti", label: ui.navContatti },
  ];
}

export default function Header({
  nomeBreve,
  ui,
}: {
  nomeBreve: string;
  ui: HeaderUiContent;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const nav = navFromUi(ui);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open || pathname !== "/";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-navy/95 backdrop-blur-md shadow-lg shadow-black/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-serif text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {ui.brandPrefix}
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight text-gold sm:text-2xl">
            {nomeBreve}
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium tracking-wide transition-colors ${
                  active ? "text-gold" : "text-white/85 hover:text-white"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-300 ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={open ? ui.menuCloseAriaLabel : ui.menuOpenAriaLabel}
          onClick={() => setOpen((v) => !v)}
          className="text-white md:hidden"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Nav mobile */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 pb-5 pt-3">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2.5 text-base font-medium transition-colors ${
                  active
                    ? "bg-white/10 text-gold"
                    : "text-white/85 hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
