import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/user";
import * as argon2 from "argon2";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Server-side validation
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const { name, email, password } = validationResult.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          errors: { email: ["Email já cadastrado"] },
        },
        { status: 400 }
      );
    }

    // Hash password with argon2
    const hashedPassword = await argon2.hash(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Usuário cadastrado com sucesso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        errors: { _form: ["Erro interno do servidor. Tente novamente."] },
      },
      { status: 500 }
    );
  }
}
