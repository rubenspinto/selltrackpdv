import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validations/product";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  // 1. Verify authenticated session
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { success: false, errors: { _form: ["Não autorizado. Faça login para continuar."] } },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    // 2. Validate request body with Zod
    const validationResult = createProductSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const { name, category, description, variants } = validationResult.data;

    // 3. Create ProductParent + all Variants in a single nested write (atomic)
    const product = await prisma.productParent.create({
      data: {
        name,
        category,
        description: description ?? "",
        variants: {
          create: variants.map((v) => ({
            sku: v.sku,
            size: v.size,
            color: v.color,
            price: new Prisma.Decimal(v.price),
            stockQuantity: v.stockQuantity,
            minStockLevel: v.minStockLevel,
          })),
        },
      },
      include: { variants: true },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Produto cadastrado com sucesso",
        product: { id: product.id, name: product.name },
      },
      { status: 201 },
    );
  } catch (error) {
    // 4. Handle duplicate SKU (Prisma unique constraint violation)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          errors: {
            _form: [
              "Um ou mais SKUs já estão cadastrados. Verifique e tente novamente com SKUs únicos.",
            ],
          },
        },
        { status: 409 },
      );
    }

    console.error("Product creation error:", error);
    return NextResponse.json(
      {
        success: false,
        errors: { _form: ["Erro interno do servidor. Tente novamente."] },
      },
      { status: 500 },
    );
  }
}
