"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CaretRight, House } from "@phosphor-icons/react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  pdv: "PDV",
  produtos: "Produtos",
  relatorios: "Relatórios",
  configuracoes: "Configurações",
  usuarios: "Usuários",
  perfil: "Perfil",
  editar: "Editar",
  novo: "Novo",
};

export function Breadcrumb() {
  const pathname = usePathname();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    let currentPath = "";
    for (const segment of segments) {
      currentPath += `/${segment}`;
      const label = routeLabels[segment] || segment;
      breadcrumbs.push({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        href: currentPath,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length === 0) {
    return (
      <div className="flex items-center gap-2 text-gray-400">
        <House weight="fill" className="w-4 h-4" />
        <span className="text-sm font-medium">Início</span>
      </div>
    );
  }

  return (
    <nav className="flex items-center gap-1 text-sm">
      <Link
        href="/dashboard"
        className="text-gray-400 hover:text-white transition-colors"
      >
        <House weight="fill" className="w-4 h-4" />
      </Link>

      {breadcrumbs.map((crumb, index) => (
        <Fragment key={crumb.href}>
          <CaretRight weight="bold" className="w-3 h-3 text-gray-600" />
          {index === breadcrumbs.length - 1 ? (
            <span className="text-white font-medium">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
