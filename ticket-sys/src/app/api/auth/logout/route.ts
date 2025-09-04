// src/app/api/auth/logout/route.ts
import type { NextRequest } from "next/server";

// POST /api/auth/logout
export async function DELETE(req: NextRequest) {
  try {
    // En JWT stateless no necesitas eliminar nada en la DB.
    // Solo indica al cliente que borre su token.
    return new Response(JSON.stringify({ message: "Logged out" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Error logging out", { status: 500 });
  }
}
