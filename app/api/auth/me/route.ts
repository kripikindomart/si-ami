import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { authService } from "@/lib/api/auth.service";

/**
 * GET /api/auth/me
 * Get current user dengan permissions
 */
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Unauthorized",
          },
        },
        { status: 401 }
      );
    }

    // Get user dengan permissions
    const response = await authService.getUserWithPermissions(session.userId);

    if (!response.success) {
      return NextResponse.json(response, { status: 401 });
    }

    return NextResponse.json(response);
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
