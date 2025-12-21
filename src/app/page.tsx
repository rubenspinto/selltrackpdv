import { Storefront } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-10 p-8 max-w-lg mx-auto">
        {/* Icon with glow effect */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150" />
            <Storefront
              className="relative w-28 h-28 text-emerald-500 drop-shadow-2xl"
              weight="duotone"
            />
          </div>
        </div>

        {/* Title with gradient */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            SellTrack PDV
          </h1>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-500" />
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-500" />
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
          Sistema completo de ponto de venda para sua loja de roupas
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button href="/login" variant="primary">
            Entrar
          </Button>
          <Button href="/cadastro" variant="secondary">
            Cadastrar
          </Button>
        </div>
      </div>

      {/* Footer subtle branding */}
      <div className="absolute bottom-6 text-gray-600 text-sm">
        © 2025 SellTrack PDV
      </div>
    </main>
  );
}
