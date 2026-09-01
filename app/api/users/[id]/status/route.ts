import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/lib/api/user.service";
import { getSession } from "@/lib/auth/jwt";
import { toggleStatusSchema } from "@/lib/validations";

/**
 * PATCH /api/users/[id]/status
 * Toggle user status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Unauthorized" },
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate
    const validation = toggleStatusSchema.safeParse(body);
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

    const response = await userService.toggleStatus(params.id, validation.data);

    if (!response.success) {
      return NextResponse.json(response, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: error.message },
      },
      { status: 500 }
    );
  }
}
