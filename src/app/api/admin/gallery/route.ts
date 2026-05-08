import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { galleryImages } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const createSchema = z.object({
  url: z.string().url(),
  alt: z.string().min(1),
  title: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  section: z.enum(["live", "workshops", "adventures", "food"]),
  sortOrder: z.number().int().default(0),
});

export const GET = async (request: Request) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const rows = await db.select().from(galleryImages);
  return NextResponse.json({ data: rows });
};

export const POST = async (request: Request) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "validation error", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const [created] = await db.insert(galleryImages).values(parsed.data).returning();
  return NextResponse.json({ data: created }, { status: 201 });
};
