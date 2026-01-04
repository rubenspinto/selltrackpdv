"use client";

import { ReactNode, Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { LoadingBar } from "./LoadingBar";

interface AppShellProps {
  children: ReactNode;
  /** Whether to show sidebar (false for PDV full-screen mode) */
  showSidebar?: boolean;
  /** Whether to show breadcrumb in header */
  showBreadcrumb?: boolean;
  /** Container type: 'default' has padding, 'full' uses full width */
  containerType?: "default" | "full";
}

export function AppShell({
  children,
  showSidebar = true,
  showBreadcrumb = true,
  containerType = "default",
}: AppShellProps) {
  return (
    <SessionProvider>
      <Suspense fallback={null}>
        <LoadingBar />
      </Suspense>

      <div className="min-h-screen bg-gray-950 flex flex-col">
        {/* Header */}
        <Header showBreadcrumb={showBreadcrumb} />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          {showSidebar && <Sidebar />}

          {/* Page Content */}
          <main
            className={`
              flex-1 overflow-y-auto
              ${containerType === "default" ? "p-4 lg:p-6" : ""}
            `}
          >
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
