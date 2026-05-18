import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { activityCategories, activityTemplates } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const patchSchema = z.object({
  value: z
    .string()
    .min(1)
    .max(40)
    .regex(/^[a-z][a-z0-9_-]*$/)
    .optional(),
  labelEn: z.string().min(1).max(80).optional(),
  labelSq: z.string().max(80).nullable().optional(),
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

  const updated = await db.transaction(async (tx) => {
    const [before] = await tx
      .select()
      .from(activityCategories)
      .where(eq(activityCategories.id, id))
      .limit(1);
    if (!before) return null;

    if (parsed.data.value && parsed.data.value !== before.value) {
      await tx
        .update(activityTemplates)
        .set({ category: parsed.data.value })
        .where(eq(activityTemplates.category, before.value));
    }

    const [row] = await tx
      .update(activityCategories)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(activityCategories.id, id))
      .returning();
    return row;
  });

  if (!updated) {
    return NextResponse.json({ message: "not found" }, { status: 404 });
  }
  return NextResponse.json({ data: updated });
};

export const DELETE = async (request: Request, { params }: Ctx) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const { id } = await params;

  const [target] = await db
    .select({ value: activityCategories.value })
    .from(activityCategories)
    .where(eq(activityCategories.id, id))
    .limit(1);

  if (!target) {
    return NextResponse.json({ message: "not found" }, { status: 404 });
  }

  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(activityTemplates)
    .where(eq(activityTemplates.category, target.value));

  if (count > 0) {
    return NextResponse.json(
      {
        message: `cannot delete: ${count} activit${count === 1 ? "y is" : "ies are"} using this category`,
      },
      { status: 409 },
    );
  }

  await db.delete(activityCategories).where(eq(activityCategories.id, id));
  return new NextResponse(null, { status: 204 });
};
