// src/app/api/auth/route.ts
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const PRIV_HASH_SECRET = process.env.PRIV_HASH_SECRET || "";
if (!PRIV_HASH_SECRET) {
  throw new Error("Private hash secret not defined in .env");
}

const JWT_SECRET = process.env.PRIV_JWT_SECRET || "";
if (!JWT_SECRET) {
  throw new Error("JWT secret not defined in .env");
}

// POST /api/auth/login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response("Missing username or password", { status: 400 });
    }

    // Buscar usuario por username
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      // Usuario no encontrado
      return new Response("User does not exist", { status: 404 });
    }

    // Comparar password con hash
    const isValid = await bcrypt.compare(
      password + PRIV_HASH_SECRET,
      user.passHash,
    );
    if (!isValid) {
      // Contraseña incorrecta
      return new Response("Incorrect password", { status: 401 });
    }
    // Generar JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }, // duración del token
    );

    // Devolver token
    return new Response(JSON.stringify({ token, username: user.username, role: user.role }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error logging in", { status: 500 });
  }
}
