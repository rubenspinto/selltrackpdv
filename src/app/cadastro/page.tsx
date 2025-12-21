import Link from "next/link";
import { Storefront, ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function CadastroPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 p-8">
        {/* Small logo */}
        <div className="flex justify-center">
          <Storefront
            className="w-16 h-16 text-emerald-500"
            weight="duotone"
          />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">
            Página de Cadastro
          </h1>
          <p className="text-gray-400 text-lg">
            Em construção...
          </p>
        </div>

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-colors font-medium"
        >
          <ArrowLeft weight="bold" className="w-5 h-5" />
          Voltar para Home
        </Link>
      </div>
    </main>
  );
}
