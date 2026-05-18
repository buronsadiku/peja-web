import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { activityTemplates } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const patchSchema = z.object({
  nameEn: z.string().min(1).optional(),
  nameSq: z.string().nullable().optional(),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  descriptionEn: z.string().nullable().optional(),
  descriptionSq: z.string().nullable().optional(),
  contactPhone1: z.string().max(40).nullable().optional(),
  contactPhone2: z.string().max(40).nullable().optional(),
  category: z
    .string()
    .min(1)
    .regex(/^[a-z][a-z0-9_-]*$/)
    .optional(),
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
    .update(activityTemplates)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(activityTemplates.id, id))
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
    .delete(activityTemplates)
    .where(eq(activityTemplates.id, id))
    .returning({ id: activityTemplates.id });

  if (!deleted) {
    return NextResponse.json({ message: "not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
};
