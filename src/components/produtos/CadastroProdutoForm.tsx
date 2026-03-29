"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Plus, Trash, Package, Tag } from "@phosphor-icons/react";
import { z } from "zod";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { FormButton } from "@/components/ui/FormButton";
import { createProductSchema } from "@/lib/validations/product";

// ─── Price mask helpers ─────────────────────────────────────────────────────

function formatPrice(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const cents = parseInt(digits, 10);
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// ─── Form types ──────────────────────────────────────────────────────────────
// UseFieldArray and react-hook-form work with the "input" shape (pre-transform).
// z.input gives us the raw type before Zod transformations run.

type FormValues = z.input<typeof createProductSchema>;

// ─── Default blank variant ───────────────────────────────────────────────────

const emptyVariant = (): FormValues["variants"][number] => ({
  sku: "",
  size: "P",
  color: "",
  price: "",
  stockQuantity: 0,
  minStockLevel: 10,
});

// ─── Component ───────────────────────────────────────────────────────────────

export default function CadastroProdutoForm() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // Cast resolver: zodResolver returns the output type, but RHF works with input type.
    // This is safe because the resolver still validates correctly at runtime.
    resolver: zodResolver(createProductSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      name: "",
      category: "",
      description: "",
      variants: [emptyVariant()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async (data) => {
      const toastId = toast.loading("Salvando produto…");

      try {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          const msg =
            (result.errors as Record<string, string[]> | undefined)?._form?.[0] ??
            "Erro ao cadastrar produto. Verifique os dados.";
          toast.update(toastId, {
            render: msg,
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
          return;
        }

        toast.update(toastId, {
          render: "Produto cadastrado com sucesso!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        setTimeout(() => router.push("/produtos"), 1500);
      } catch {
        toast.update(toastId, {
          render: "Erro de conexão. Tente novamente.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    },
    [router],
  );

  return (
    <div className="relative overflow-hidden px-4 py-6">
      <div className="relative z-10 w-full max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/20">
            <Package className="w-7 h-7 text-emerald-400" weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Cadastrar Produto</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Preencha as informações gerais e adicione as variações do produto.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          {/* ── Section 1: Produto Pai ── */}
          <section className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-4 h-4 text-emerald-400" weight="bold" />
              <h2 className="text-base font-semibold text-emerald-400 uppercase tracking-wide">
                Informações Gerais
              </h2>
            </div>

            <Input
              id="name"
              label="Nome do Produto *"
              placeholder="Ex: Camiseta Básica"
              error={errors.name?.message}
              disabled={isSubmitting}
              {...register("name")}
            />

            <Input
              id="category"
              label="Categoria *"
              placeholder="Ex: Camisetas, Calças, Acessórios…"
              error={errors.category?.message}
              disabled={isSubmitting}
              {...register("category")}
            />

            <TextArea
              id="description"
              label="Descrição (opcional)"
              placeholder="Descreva o produto brevemente…"
              disabled={isSubmitting}
              {...register("description")}
            />
          </section>

          {/* ── Section 2: Variações ── */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-emerald-500" />
                <h2 className="text-base font-semibold text-white">
                  Variações do Produto
                </h2>
              </div>

              <button
                type="button"
                onClick={() => append(emptyVariant())}
                disabled={isSubmitting}
                className="
                  flex items-center gap-2 px-4 py-2
                  text-sm font-medium text-emerald-400
                  border border-emerald-500/40 rounded-xl
                  hover:bg-emerald-500/10 hover:border-emerald-500/70
                  transition-all duration-200
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                <Plus weight="bold" className="w-4 h-4" />
                Adicionar Variação
              </button>
            </div>

            {/* Array-level error (e.g., "min 1 variant") */}
            {errors.variants?.root?.message && (
              <p className="text-sm text-red-400">{errors.variants.root.message}</p>
            )}

            {fields.map((field, index) => {
              const ve = errors.variants?.[index];
              return (
                <div
                  key={field.id}
                  className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-5 space-y-4"
                >
                  {/* Variant header */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-400">
                      Variação #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1 || isSubmitting}
                      title="Remover variação"
                      className="
                        flex items-center gap-1.5 px-3 py-1.5
                        text-xs font-medium text-red-400
                        border border-red-500/30 rounded-lg
                        hover:bg-red-500/10 hover:border-red-500/60
                        transition-all duration-200
                        disabled:opacity-30 disabled:cursor-not-allowed
                      "
                    >
                      <Trash weight="bold" className="w-3.5 h-3.5" />
                      Remover
                    </button>
                  </div>

                  {/* Row 1: SKU + Size + Color */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      id={`variants.${index}.sku`}
                      label="SKU *"
                      placeholder="Ex: CB-P-AZ"
                      error={ve?.sku?.message}
                      disabled={isSubmitting}
                      {...register(`variants.${index}.sku`)}
                    />

                    <Select
                      id={`variants.${index}.size`}
                      label="Tamanho *"
                      error={ve?.size?.message}
                      disabled={isSubmitting}
                      {...register(`variants.${index}.size`)}
                    >
                      <option value="P">P</option>
                      <option value="M">M</option>
                      <option value="G">G</option>
                    </Select>

                    <Input
                      id={`variants.${index}.color`}
                      label="Cor *"
                      placeholder="Ex: Azul"
                      error={ve?.color?.message}
                      disabled={isSubmitting}
                      {...register(`variants.${index}.color`)}
                    />
                  </div>

                  {/* Row 2: Price + Stock + MinStock */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Price with R$ mask via Controller */}
                    <Controller
                      name={`variants.${index}.price`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          id={`variants.${index}.price`}
                          label="Preço *"
                          placeholder="R$ 0,00"
                          error={ve?.price?.message as string | undefined}
                          disabled={isSubmitting}
                          value={field.value as string}
                          onChange={(e) => {
                            field.onChange(formatPrice(e.target.value));
                          }}
                          onBlur={field.onBlur}
                        />
                      )}
                    />

                    <Input
                      id={`variants.${index}.stockQuantity`}
                      label="Estoque Atual"
                      type="number"
                      min={0}
                      placeholder="0"
                      error={ve?.stockQuantity?.message}
                      disabled={isSubmitting}
                      {...register(`variants.${index}.stockQuantity`)}
                    />

                    <Input
                      id={`variants.${index}.minStockLevel`}
                      label="Estoque Mínimo"
                      type="number"
                      min={0}
                      placeholder="10"
                      error={ve?.minStockLevel?.message}
                      disabled={isSubmitting}
                      {...register(`variants.${index}.minStockLevel`)}
                    />
                  </div>
                </div>
              );
            })}
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <FormButton type="submit" variant="primary" isLoading={isSubmitting}>
              Salvar Produto
            </FormButton>
            <FormButton
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => router.push("/produtos")}
            >
              Cancelar
            </FormButton>
          </div>
        </form>
      </div>
    </div>
  );
}
