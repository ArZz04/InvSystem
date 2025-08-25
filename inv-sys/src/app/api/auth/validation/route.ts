import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { Role } from "@/app/types";

const JWT_SECRET = process.env.PRIV_JWT_SECRET as string;

function generateCode(length = 5) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Mapa de números a Role
const roleMap: Record<number, Role> = {
  0: Role.Administrador,
  1: Role.Almacenista,
  2: Role.Auxiliar,
  3: Role.Vendedor,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role: roleNumber, email } = body;

    if (roleNumber === undefined || !(roleNumber in roleMap)) {
      return Response.json({ error: "Invalid role number" }, { status: 400 });
    }
    if (!email) {
      return Response.json({ error: "Missing email" }, { status: 400 });
    }

    const role = roleMap[roleNumber];

    // crear token JWT con datos
    const token = jwt.sign(
      { role, email },
      JWT_SECRET,
      { expiresIn: "1h" }, // expira en 1 hora
    );

    // generar código corto
    let code = generateCode();

    // evitar duplicados
    while (await prisma.inviteCode.findUnique({ where: { code } })) {
      code = generateCode();
    }

    // guardar en BD
    await prisma.inviteCode.create({
      data: {
        code,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1h
      },
    });

    return Response.json({ code }, { status: 201 });
  } catch (err) {
    console.error("Error generating invite code:", err);
    return Response.json(
      { error: "Error generating invite code" },
      { status: 500 },
    );
  }
}
