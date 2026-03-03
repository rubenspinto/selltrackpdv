import Link from "next/link";
import { Storefront } from "@phosphor-icons/react/dist/ssr";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center space-y-8 p-8">
        {/* Ícone */}
        <div className="flex justify-center">
          <Storefront className="w-24 h-24 text-emerald-500" weight="duotone" />
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          SellTrack PDV
        </h1>

        {/* Descrição */}
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Sistema completo de ponto de venda para sua loja de roupas
        </p>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="px-8 py-3 border-2 border-emerald-600 text-emerald-500 hover:bg-emerald-600 hover:text-white font-semibold rounded-lg transition-colors"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    </main>
  );
}
