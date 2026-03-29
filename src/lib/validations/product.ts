import { z } from "zod";

// Strip the R$ mask and convert to a number for validation
const priceString = z
  .string()
  .min(1, "Preço é obrigatório")
  .transform((val) => {
    // Remove "R$", spaces, dots (thousand sep) and replace comma with dot
    const numeric = val
      .replace(/R\$\s?/g, "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim();
    return parseFloat(numeric);
  })
  .refine((val) => !isNaN(val) && val >= 0, {
    message: "Preço inválido",
  });

export const productVariantSchema = z.object({
  sku: z.string().min(1, "SKU é obrigatório"),
  size: z.enum(["P", "M", "G"] as const, { error: "Tamanho é obrigatório" }),
  color: z.string().min(1, "Cor é obrigatória"),
  price: priceString,
  stockQuantity: z.coerce
    .number()
    .int("Estoque deve ser um número inteiro")
    .min(0, "Estoque não pode ser negativo")
    .default(0),
  minStockLevel: z.coerce
    .number()
    .int("Estoque mínimo deve ser um número inteiro")
    .min(0, "Estoque mínimo não pode ser negativo")
    .default(10),
});

export const productParentSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  category: z.string().min(1, "Categoria é obrigatória"),
  description: z.string().optional().default(""),
});

export const createProductSchema = productParentSchema.extend({
  variants: z
    .array(productVariantSchema)
    .min(1, "Adicione pelo menos uma variação"),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type ProductParentInput = z.infer<typeof productParentSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
