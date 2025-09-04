// src/app/api/auth/register/route.ts
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role as PrismaRole } from "@/generated/prisma/index";


const PRIV_HASH_SECRET = process.env.PRIV_HASH_SECRET || "";
const PRIV_JWT_SECRET = process.env.PRIV_JWT_SECRET || "";

// Mapa de string a número
const roleMap: Record<string, PrismaRole> = {
  administrador: PrismaRole.Administrador,
  compras:       PrismaRole.Compras,
  encargado:     PrismaRole.Encargado,
  cajero:        PrismaRole.Cajero,
};

// POST: crear usuario con invite code
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { inviteCode } = body;

    if (!inviteCode) {
      return new Response("Missing inviteCode", { status: 400 });
    }

    // ✅ Validar invite code
    const invite = await prisma.inviteCode.findUnique({
      where: { code: inviteCode },
    });

    if (!invite || invite.used || invite.expiresAt < new Date()) {
      return new Response("Invalid or expired invite code", { status: 400 });
    }

    // Decodificar JWT del invite
    const payload = jwt.verify(invite.token, PRIV_JWT_SECRET as string) as {
      role: string;
      email: string;
    };

    const roleNumber = payload.role

    // Validaciones de campos requeridos
    const requiredFields = [
      "username",
      "firstName",
      "lastNameP",
      "lastNameM",
      "passHash",
      "birthDay",
      "birthMonth",
      "birthYear",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return new Response(`Missing field: ${field}`, { status: 400 });
      }
    }

    // Validar duplicados
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: body.username }, { email: payload.email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === body.username)
        return new Response("Username already exists", { status: 409 });
      if (existingUser.email === payload.email)
        return new Response("Email already exists", { status: 409 });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(
      body.passHash + PRIV_HASH_SECRET,
      10,
    );

    // Obtener último número de empleado
    const lastEmployee = await prisma.user.findFirst({
      orderBy: { n_employee: "desc" },
    });
    const nextEmployeeNumber = (lastEmployee?.n_employee ?? 1000) + 1;
    

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        n_employee: nextEmployeeNumber,
        username: body.username,
        firstName: body.firstName,
        lastNameP: body.lastNameP,
        lastNameM: body.lastNameM,
        passHash: hashedPassword,
        birthDay: Number(body.birthDay),
        birthMonth: Number(body.birthMonth),
        birthYear: Number(body.birthYear),
        email: payload.email, // viene del token
        role: +roleNumber, // viene del token
        status: true,
      },
    });

    // Marcar invite code como usado
    await prisma.inviteCode.update({
      where: { code: inviteCode },
      data: { used: true },
    });

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Error creating user", { status: 500 });
  }
}
