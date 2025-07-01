import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          userId: crypto.randomUUID(),
          email,
          password: hashedPassword,
        },
      });

      return NextResponse.json({
        message: "User created successfully",
        user: { id: newUser.id, email: newUser.email },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Sign in successful",
      user: { id: existingUser.id, email: existingUser.email },
    });
  } catch (error) {
    return NextResponse.json({ error: "Sign-in failed" }, { status: 500 });
  }
}