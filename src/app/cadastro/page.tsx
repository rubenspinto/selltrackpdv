"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Storefront } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/Input";
import { FormButton } from "@/components/ui/FormButton";
import { registerSchema } from "@/lib/validations/user";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function CadastroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name: keyof FormData, value: string) => {
    const dataToValidate = { ...formData, [name]: value };
    const result = registerSchema.safeParse(dataToValidate);
    
    if (!result.success) {
      const fieldError = result.error.flatten().fieldErrors[name];
      return fieldError?.[0] || "";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    const error = validateField(name as keyof FormData, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Client-side validation
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      toast.error("Por favor, corrija os erros no formulário.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors({
            name: data.errors.name?.[0],
            email: data.errors.email?.[0],
            password: data.errors.password?.[0],
            confirmPassword: data.errors.confirmPassword?.[0],
          });
          const formError = data.errors._form?.[0];
          toast.error(formError || "Erro ao realizar cadastro. Verifique os dados.");
        }
        setIsLoading(false);
        return;
      }

      toast.success("Cadastro realizado com sucesso! Redirecionando...");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      toast.error("Erro de conexão. Tente novamente.");
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/login");
  };

  const hasErrors = Object.values(errors).some((error) => error);
  const allFieldsFilled = Object.values(formData).every((value) => value.length > 0);

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
              className="w-16 h-16 text-emerald-500"
              weight="duotone"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Criar sua conta</h1>
            <p className="text-gray-400">
              Preencha os dados para se cadastrar
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="name"
            name="name"
            type="text"
            label="Nome completo"
            placeholder="Digite seu nome"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name ? errors.name : undefined}
            disabled={isLoading}
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Digite seu email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : undefined}
            disabled={isLoading}
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Senha"
            placeholder="Crie uma senha"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : undefined}
            disabled={isLoading}
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirmar senha"
            placeholder="Digite a senha novamente"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
            disabled={isLoading}
          />

          <div className="space-y-3 pt-2">
            <FormButton
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={!allFieldsFilled || hasErrors}
            >
              Criar conta
            </FormButton>

            <FormButton
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </FormButton>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center pt-4">
          <p className="text-gray-400">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
