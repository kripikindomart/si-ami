import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/api/auth.service";
import { setSession } from "@/lib/auth/jwt";
import { loginSchema } from "@/lib/validations";

/**
 * POST /api/auth/login
 * Login dengan email & password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Input tidak valid",
            fields: validation.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    // Login
    const response = await authService.login(validation.data);

    if (!response.success) {
      return NextResponse.json(response, { status: 401 });
    }

    // Set session cookie
    await setSession(response.data);

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
