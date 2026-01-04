"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { User, SignOut, CaretDown, Gear } from "@phosphor-icons/react";
import { toast } from "react-toastify";

export function UserMenu() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || "Usuário";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirect: true, callbackUrl: "/login" });
      toast.success("Logout realizado com sucesso!");
    } catch {
      toast.error("Erro ao sair. Tente novamente.");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 px-2 py-1.5 rounded-lg
          hover:bg-gray-800 transition-colors
          focus:outline-none focus:ring-2 focus:ring-emerald-500/50
        "
      >
        {/* Avatar */}
        <div
          className="
            w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600
            flex items-center justify-center
            text-white text-sm font-semibold
          "
        >
          {initials}
        </div>

        <span className="text-gray-300 text-sm font-medium hidden sm:block max-w-[120px] truncate">
          {userName}
        </span>

        <CaretDown
          weight="bold"
          className={`
            w-4 h-4 text-gray-400
            transition-transform duration-200
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="
            absolute right-0 top-full mt-2
            w-56 py-2
            bg-gray-800 border border-gray-700 rounded-lg shadow-xl
            z-50
          "
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-white font-medium truncate">{userName}</p>
            <p className="text-gray-400 text-sm truncate">
              {session?.user?.email || ""}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/configuracoes/perfil");
              }}
              className="
                w-full flex items-center gap-3 px-4 py-2
                text-gray-300 hover:text-white hover:bg-gray-700/50
                transition-colors text-left
              "
            >
              <User weight="bold" className="w-4 h-4" />
              <span>Meu Perfil</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/configuracoes");
              }}
              className="
                w-full flex items-center gap-3 px-4 py-2
                text-gray-300 hover:text-white hover:bg-gray-700/50
                transition-colors text-left
              "
            >
              <Gear weight="bold" className="w-4 h-4" />
              <span>Configurações</span>
            </button>
          </div>

          {/* Logout */}
          <div className="pt-2 border-t border-gray-700">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="
                w-full flex items-center gap-3 px-4 py-2
                text-red-400 hover:text-red-300 hover:bg-red-500/10
                transition-colors text-left
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <SignOut weight="bold" className="w-4 h-4" />
              <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
