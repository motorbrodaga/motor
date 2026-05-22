"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/features/shell/nav-items";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="desktop-nav" aria-label="Основная навигация">
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            className="desktop-nav__item"
            data-active={active}
            href={item.href}
          >
            <Icon aria-hidden="true" size={19} strokeWidth={2.3} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
