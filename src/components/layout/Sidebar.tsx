"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  House,
  Storefront,
  Package,
  ChartBar,
  Gear,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  highlight?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: House },
  { label: "PDV", href: "/pdv", icon: Storefront, highlight: true },
  { label: "Produtos", href: "/produtos", icon: Package },
  { label: "Relatórios", href: "/relatorios", icon: ChartBar },
  { label: "Configurações", href: "/configuracoes", icon: Gear },
];

interface SidebarProps {
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({
  defaultCollapsed = false,
  onCollapsedChange,
}: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  useEffect(() => {
    // Persist sidebar state in localStorage
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
    onCollapsedChange?.(newState);
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href || pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`
        flex flex-col
        h-full
        bg-gray-900 border-r border-gray-800
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-16" : "w-60"}
      `}
    >
      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group relative flex items-center gap-3 
                px-3 py-2.5 rounded-lg
                transition-all duration-200
                ${
                  active
                    ? item.highlight
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-gray-800 text-white"
                    : item.highlight
                    ? "text-emerald-400 hover:bg-emerald-500/10"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }
                ${
                  item.highlight && !active
                    ? "border border-emerald-500/30"
                    : ""
                }
              `}
            >
              <Icon
                weight={active ? "fill" : "bold"}
                className={`
                  w-5 h-5 flex-shrink-0
                  transition-transform group-hover:scale-110
                `}
              />

              {/* Label */}
              <span
                className={`
                  font-medium text-sm whitespace-nowrap
                  transition-opacity duration-200
                  ${
                    isCollapsed
                      ? "opacity-0 w-0 overflow-hidden"
                      : "opacity-100"
                  }
                `}
              >
                {item.label}
              </span>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div
                  className="
                    absolute left-full ml-2 px-2 py-1
                    bg-gray-800 text-white text-sm font-medium
                    rounded-md whitespace-nowrap
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible
                    transition-all duration-200
                    z-50
                  "
                >
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800" />
                </div>
              )}

              {/* Active indicator */}
              {active && (
                <div
                  className={`
                    absolute left-0 top-1/2 -translate-y-1/2
                    w-1 h-6 rounded-r-full
                    ${item.highlight ? "bg-emerald-400" : "bg-white"}
                  `}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-gray-800">
        <button
          onClick={toggleCollapsed}
          className="
            w-full flex items-center justify-center gap-2
            px-3 py-2 rounded-lg
            text-gray-400 hover:text-white hover:bg-gray-800
            transition-colors
          "
          aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? (
            <CaretRight weight="bold" className="w-4 h-4" />
          ) : (
            <>
              <CaretLeft weight="bold" className="w-4 h-4" />
              <span className="text-sm">Recolher</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
