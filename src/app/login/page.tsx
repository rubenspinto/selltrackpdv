"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignIn, Storefront } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/Input";
import { FormButton } from "@/components/ui/FormButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 || response.status === 401) {
          toast.error(data.error || "Email ou senha inválidos");
        } else {
          toast.error("Erro ao realizar login. Tente novamente.");
        }
        setIsLoading(false);
        return;
      }

      toast.success("Login realizado com sucesso!");

      // Redirect to PDV after 500ms
      setTimeout(() => {
        router.push("/pdv");
      }, 500);
    } catch {
      toast.error("Erro de conexão. Tente novamente.");
      setIsLoading(false);
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
      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Storefront
              className="w-20 h-20 text-emerald-500"
              weight="duotone"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Bem-vindo</h1>
            <p className="text-gray-400">
              Entre para acessar o sistema de PDV
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
          />

          <FormButton type="submit" variant="primary" isLoading={isLoading}>
            <SignIn weight="bold" className="w-5 h-5 mr-2" />
            Entrar
          </FormButton>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400">
            Não tem uma conta?{" "}
            <a
              href="/cadastro"
              className="text-emerald-500 hover:text-emerald-400 transition-colors font-medium"
            >
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
