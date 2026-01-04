"use client";

import { Breadcrumb } from "./Breadcrumb";
import { ConnectionWidget } from "./ConnectionWidget";
import { UserMenu } from "./UserMenu";
import { Storefront } from "@phosphor-icons/react";
import Link from "next/link";

interface HeaderProps {
  showBreadcrumb?: boolean;
}

export function Header({ showBreadcrumb = true }: HeaderProps) {
  return (
    <header
      className="
        h-[60px] w-full
        bg-gray-900/80 backdrop-blur-sm
        border-b border-gray-800
        flex items-center justify-between
        px-4 lg:px-6
        sticky top-0 z-40
      "
    >
      {/* Left: Logo + Breadcrumb */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          <Storefront weight="duotone" className="w-7 h-7" />
          <span className="font-bold text-lg hidden md:block">SellTrack</span>
        </Link>

        {showBreadcrumb && (
          <>
            <div className="h-6 w-px bg-gray-700 hidden sm:block" />
            <div className="hidden sm:block">
              <Breadcrumb />
            </div>
          </>
        )}
      </div>

      {/* Center: Connection Status */}
      <div className="flex-1 flex justify-center">
        <ConnectionWidget />
      </div>

      {/* Right: User Menu */}
      <div className="flex items-center">
        <UserMenu />
      </div>
    </header>
  );
}
