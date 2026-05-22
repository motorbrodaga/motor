import { Clock3, Inbox, LayoutDashboard, MoreHorizontal, RefreshCw } from "lucide-react";

export const navItems = [
  {
    href: "/dashboard",
    label: "Панель",
    icon: LayoutDashboard
  },
  {
    href: "/inbox",
    label: "Входящие",
    icon: Inbox
  },
  {
    href: "/waiting",
    label: "Ожидания",
    icon: Clock3
  },
  {
    href: "/review",
    label: "Обзор",
    icon: RefreshCw
  },
  {
    href: "/more",
    label: "Еще",
    icon: MoreHorizontal
  }
] as const;
