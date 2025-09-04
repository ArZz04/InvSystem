// src/app/api/auth/employees/route.ts
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "@/app/types";

const PRIV_HASH_SECRET = process.env.PRIV_HASH_SECRET || "";
const PRIV_JWT_SECRET = process.env.PRIV_JWT_SECRET || "";

// Función para extraer usuario del token
async function getUserFromToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.includes("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader; // si no tiene Bearer, usa lo que haya

  try {
    return jwt.verify(token, PRIV_JWT_SECRET) as { id: string; role: Role };
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
}

// GET: obtener usuarios con paginación
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);

    if (!user || user.role !== Role.Administrador) {
      return new Response("Unauthorized", { status: 403 });
    }

    // Obtener query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10); // página actual
    const limit = 10; // registros por página
    const skip = (page - 1) * limit;

    // Obtener total de usuarios
    const totalUsers = await prisma.user.count();

    // Obtener usuarios paginados
    const users = await prisma.user.findMany({
      skip,
      take: limit,
    });

    // Respuesta con paginación
    return new Response(
      JSON.stringify({
        page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        users,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response("Error fetching users", { status: 500 });
  }
}

// PUT: actualizar un usuario completo
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await getUserFromToken(req);
    if (!user) return new Response("Unauthorized", { status: 403 });

    const isAdmin = user.role === Role.Administrador;
    const isSelf = user.id === body.id;

    if (!isAdmin && !isSelf) {
      return new Response("Forbidden", { status: 403 });
    }

    // Si no es admin, no puede cambiar rol ni status
    if (!isAdmin) {
      delete body.role;
      delete body.status;
    }

    // Hashear contraseña si se envía
    let passHash = body.passHash;
    if (passHash) {
      passHash = await bcrypt.hash(passHash + PRIV_HASH_SECRET, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: body.id },
      data: {
        username: body.username,
        firstName: body.firstName,
        lastNameP: body.lastNameP,
        lastNameM: body.lastNameM,
        passHash,
        birthDay: body.birthDay,
        birthMonth: body.birthMonth,
        birthYear: body.birthYear,
        email: body.email,
        role: body.role,
        status: body.status,
      },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error updating user", { status: 500 });
  }
}

// PATCH: activar/desactivar un usuario (solo admin)
export async function PATCH(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== Role.Administrador) {
      return new Response("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { id, active } = body;

    if (typeof active !== "boolean") {
      return new Response("Missing or invalid 'active' field", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status: active },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error updating user status", { status: 500 });
  }
}