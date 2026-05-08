import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { galleryImages } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const patchSchema = z.object({
  url: z.string().url().optional(),
  alt: z.string().optional(),
  title: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  section: z.enum(["live", "workshops", "adventures", "food"]).optional(),
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
    .update(galleryImages)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(galleryImages.id, id))
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
    .delete(galleryImages)
    .where(eq(galleryImages.id, id))
    .returning({ id: galleryImages.id });

  if (!deleted) {
    return NextResponse.json({ message: "not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
};
