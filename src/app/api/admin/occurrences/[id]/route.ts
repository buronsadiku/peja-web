import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { activityOccurrences } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const patchSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  capacity: z.number().int().min(0).optional(),
  location: z.string().nullable().optional(),
  meetingPoint: z.string().nullable().optional(),
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
    .update(activityOccurrences)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(activityOccurrences.id, id))
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
    .delete(activityOccurrences)
    .where(eq(activityOccurrences.id, id))
    .returning({ id: activityOccurrences.id });

  if (!deleted) {
    return NextResponse.json({ message: "not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
};
