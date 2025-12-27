"use client";

import { useRouter } from "next/navigation";
import { Storefront, SignOut, HardHat } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import { FormButton } from "@/components/ui/FormButton";
import { useState } from "react";

export default function PdvPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const { signOut } = await import("next-auth/react");
      await signOut({ redirect: true, callbackUrl: "/login" });
      toast.success("Logout realizado com sucesso!");
    } catch {
      toast.error("Erro de conexão. Tente novamente.");
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md space-y-8 text-center">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <Storefront
              className="w-20 h-20 text-emerald-500"
              weight="duotone"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Área de PDV</h1>
            <div className="flex items-center justify-center gap-2 text-amber-400">
              <HardHat weight="duotone" className="w-5 h-5" />
              <p className="text-lg">Em construção</p>
            </div>
            <p className="text-gray-400 mt-4">
              Esta área está sendo desenvolvida. Em breve você poderá realizar vendas por aqui.
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-8 max-w-xs mx-auto">
          <FormButton
            type="button"
            variant="secondary"
            onClick={handleLogout}
            isLoading={isLoggingOut}
          >
            <SignOut weight="bold" className="w-5 h-5 mr-2" />
            Sair da conta
          </FormButton>
        </div>
      </div>
    </main>
  );
}
