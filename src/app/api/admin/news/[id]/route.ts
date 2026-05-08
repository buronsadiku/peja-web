import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { newsPosts } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const patchSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  title: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  imageUrl: z.string().nullable().optional(),
  pinned: z.boolean().optional(),
  publishedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
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

  const update: Record<string, unknown> = {
    ...parsed.data,
    updatedAt: new Date(),
  };
  if (parsed.data.publishedAt) {
    update.publishedAt = new Date(parsed.data.publishedAt);
  }
  if (parsed.data.expiresAt !== undefined) {
    update.expiresAt = parsed.data.expiresAt
      ? new Date(parsed.data.expiresAt)
      : null;
  }

  const [updated] = await db
    .update(newsPosts)
    .set(update)
    .where(eq(newsPosts.id, id))
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
    .delete(newsPosts)
    .where(eq(newsPosts.id, id))
    .returning({ id: newsPosts.id });

  if (!deleted) {
    return NextResponse.json({ message: "not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
};
