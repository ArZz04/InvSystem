// src/app/api/users/route.ts
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

const PRIV_HASH_SECRET = process.env.PRIV_HASH_SECRET || "";

// GET: obtener todos los usuarios
export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany();
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error fetching users", { status: 500 });
  }
}

// POST: crear un usuario
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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
      "email",
      "role",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return new Response(`Missing field: ${field}`, { status: 400 });
      }
    }

    // Validar si username o email ya existen
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === body.username) {
        return new Response("Username already exists", { status: 409 });
      }
      if (existingUser.email === body.email) {
        return new Response("Email already exists", { status: 409 });
      }
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(
      body.passHash + PRIV_HASH_SECRET,
      10,
    );

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        firstName: body.firstName,
        lastNameP: body.lastNameP,
        lastNameM: body.lastNameM,
        passHash: hashedPassword,
        birthDay: body.birthDay,
        birthMonth: body.birthMonth,
        birthYear: body.birthYear,
        email: body.email,
        role: body.role,
      },
    });

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Error creating user", { status: 500 });
  }
}

// PUT: actualizar un usuario
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updatedUser = await prisma.user.update({
      where: { id: body.id },
      data: {
        username: body.username,
        firstName: body.firstName,
        lastNameP: body.lastNameP,
        lastNameM: body.lastNameM,
        passHash: body.passHash,
        birthDay: body.birthDay,
        birthMonth: body.birthMonth,
        birthYear: body.birthYear,
        email: body.email,
        role: body.role,
      },
    });
    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error updating user", { status: 500 });
  }
}

// DELETE: eliminar un usuario
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const deletedUser = await prisma.user.delete({
      where: { id: body.id },
    });
    return new Response(JSON.stringify(deletedUser), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error deleting user", { status: 500 });
  }
}
