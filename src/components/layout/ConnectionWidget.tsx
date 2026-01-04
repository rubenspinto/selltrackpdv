"use client";

import { useEffect, useState } from "react";
import { WifiHigh, WifiSlash, WifiMedium } from "@phosphor-icons/react";

type ConnectionStatus = "online" | "offline" | "unstable";

export function ConnectionWidget() {
  const [status, setStatus] = useState<ConnectionStatus>("online");

  useEffect(() => {
    const updateStatus = () => {
      if (!navigator.onLine) {
        setStatus("offline");
        return;
      }
      setStatus("online");
    };

    // Check initial status
    updateStatus();

    // Listen for online/offline events
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    // Periodic check for connection stability
    const interval = setInterval(async () => {
      if (!navigator.onLine) {
        setStatus("offline");
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        await fetch("/api/health", {
          method: "HEAD",
          signal: controller.signal,
          cache: "no-store",
        });

        clearTimeout(timeoutId);
        setStatus("online");
      } catch {
        setStatus(navigator.onLine ? "unstable" : "offline");
      }
    }, 30000);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
      clearInterval(interval);
    };
  }, []);

  const statusConfig = {
    online: {
      icon: WifiHigh,
      color: "text-emerald-400",
      tooltip: "Conexão estável",
      pulse: false,
    },
    unstable: {
      icon: WifiMedium,
      color: "text-amber-400",
      tooltip: "Conexão instável...",
      pulse: true,
    },
    offline: {
      icon: WifiSlash,
      color: "text-red-400",
      tooltip: "Sem conexão - Tentando reconectar...",
      pulse: true,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="relative group">
      <div
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg
          transition-all duration-200
          ${status !== "online" ? "bg-gray-800/50" : ""}
        `}
      >
        <Icon
          weight="bold"
          className={`
            w-5 h-5 ${config.color}
            ${config.pulse ? "animate-pulse" : ""}
          `}
        />
        {status !== "online" && (
          <span className={`text-sm font-medium ${config.color}`}>
            {status === "unstable" ? "Instável" : "Offline"}
          </span>
        )}
      </div>

      {/* Tooltip */}
      <div
        className="
          absolute top-full left-1/2 -translate-x-1/2 mt-2
          px-3 py-1.5 rounded-md
          bg-gray-800 text-gray-200 text-xs font-medium
          whitespace-nowrap
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-200
          z-50
        "
      >
        {config.tooltip}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800" />
      </div>
    </div>
  );
}
