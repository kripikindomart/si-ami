import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/lib/api/user.service";
import { getSession } from "@/lib/auth/jwt";
import { userFilterSchema, createUserWithUnitsSchema } from "@/lib/validations";

/**
 * GET /api/users
 * Get users list dengan filter, search, pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Check session
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

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      roleId: searchParams.get("roleId") || undefined,
      status: searchParams.get("status") as "aktif" | "nonaktif" | undefined,
      search: searchParams.get("search") || undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      sortBy: (searchParams.get("sortBy") as "nama" | "email" | "createdAt") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    };

    // Validate filters
    const validation = userFilterSchema.safeParse(filters);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid filters",
            fields: validation.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    // Get users
    const response = await userService.getAll(validation.data);

    if (!response.success) {
      return NextResponse.json(response, { status: 500 });
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

/**
 * POST /api/users
 * Create new user
 */
export async function POST(request: NextRequest) {
  try {
    // Check session
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

    const body = await request.json();

    // Validate input
    const validation = createUserWithUnitsSchema.safeParse(body);
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

    // Create user
    const response = await userService.create(validation.data);

    if (!response.success) {
      return NextResponse.json(response, { status: 400 });
    }

    return NextResponse.json(response, { status: 201 });
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
