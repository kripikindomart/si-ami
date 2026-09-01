import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth/jwt";

/**
 * POST /api/auth/logout
 * Clear session cookie
 */
export async function POST() {
  try {
    await clearSession();

    return NextResponse.json({
      success: true,
      data: null,
      message: "Logout berhasil",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Terjadi kesalahan",
        },
      },
      { status: 500 }
    );
  }
}
