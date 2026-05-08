import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { activityImages } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const patchSchema = z.object({
  alt: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isCover: z.boolean().optional(),
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
    if (parsed.data.isCover) {
      const [target] = await tx
        .select({ templateId: activityImages.templateId })
        .from(activityImages)
        .where(eq(activityImages.id, id))
        .limit(1);
      if (target) {
        await tx
          .update(activityImages)
          .set({ isCover: false })
          .where(eq(activityImages.templateId, target.templateId));
      }
    }
    const [row] = await tx
      .update(activityImages)
      .set(parsed.data)
      .where(eq(activityImages.id, id))
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
  const [deleted] = await db
    .delete(activityImages)
    .where(eq(activityImages.id, id))
    .returning({ id: activityImages.id });

  if (!deleted) {
    return NextResponse.json({ message: "not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
};
