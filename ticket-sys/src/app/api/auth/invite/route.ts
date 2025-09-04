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

// Ids de los roles
const roleIds: Record<Role, number> = {
  [Role.Administrador]: 1,
  [Role.Compras]: 2,
  [Role.Encargado]: 3,
  [Role.Cajero]: 4,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { role: roleText, email } = body;

    console.log("Received invite request for email:", email, "with role:", roleText);

    if (!roleText || !(roleText in roleIds)) {
      return Response.json({ error: "Invalid role" }, { status: 400 });
    }

    if (!email) {
      return Response.json({ error: "Missing email" }, { status: 400 });
    }

    const role = roleIds[roleText as Role];

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
