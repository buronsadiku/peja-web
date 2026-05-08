import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { festivalDays } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const patchSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  label: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = async (request: Request, { params }: Ctx) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "validation error", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const [updated] = await db
    .update(festivalDays)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(festivalDays.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ message: "not found" }, { status: 404 });
  }

  return NextResponse.json({ data: updated });
};

export const DELETE = async (request: Request, { params }: Ctx) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const { id } = await params;
  try {
    const [deleted] = await db
      .delete(festivalDays)
      .where(eq(festivalDays.id, id))
      .returning({ id: festivalDays.id });

    if (!deleted) {
      return NextResponse.json({ message: "not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.toLowerCase().includes("foreign key")
    ) {
      return NextResponse.json(
        {
          message:
            "cannot delete: occurrences or registrations still reference this day",
        },
        { status: 409 },
      );
    }
    throw err;
  }
};
