import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json(); // ✅ name-ийг эндээс авна

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          userId: crypto.randomUUID(),
          email,
          password: hashedPassword,
          name, // ✅ name-ийг энд ашиглаж болно
        },
      });

      return NextResponse.json({
        message: "User created successfully",
       user: { id: newUser.userId, email: newUser.email },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Sign in successful",
      user: { id: existingUser.userId, email: existingUser.email },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Sign-in failed" }, { status: 500 });
  }
}
