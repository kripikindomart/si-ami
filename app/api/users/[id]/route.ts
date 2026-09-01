import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/lib/api/user.service";
import { getSession } from "@/lib/auth/jwt";
import { updateUserSchema } from "@/lib/validations";

/**
 * GET /api/users/[id]
 * Get user by ID
 */
export async function GET(
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

    const response = await userService.getById(params.id);

    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
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

/**
 * PUT /api/users/[id]
 * Update user
 */
export async function PUT(
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
    const validation = updateUserSchema.safeParse(body);
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

    const response = await userService.update(params.id, validation.data);

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

/**
 * DELETE /api/users/[id]
 * Delete user
 */
export async function DELETE(
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

    const response = await userService.delete(params.id);

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
