import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { musicians } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const patchSchema = z.object({
  festivalDayId: z.string().uuid().optional(),
  nameEn: z.string().min(1).max(160).optional(),
  nameSq: z.string().max(160).nullable().optional(),
  descriptionEn: z.string().nullable().optional(),
  descriptionSq: z.string().nullable().optional(),
  photoUrl: z.string().url().optional(),
  sortOrder: z.number().int().optional(),
  isPublished: z.boolean().optional(),
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
    .update(musicians)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(musicians.id, id))
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
  const [deleted] = await db
    .delete(musicians)
    .where(eq(musicians.id, id))
    .returning({ id: musicians.id });

  if (!deleted) {
    return NextResponse.json({ message: "not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
};
