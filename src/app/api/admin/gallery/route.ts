import { NextResponse } from "next/server";
import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { galleryImages } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const sectionEnum = z.enum(["live", "workshops", "adventures", "food"]);

const createSchema = z.object({
  url: z.string().url(),
  alt: z.string().default(""),
  title: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  section: z.enum(["live", "workshops", "adventures", "food"]),
  sortOrder: z.number().int().default(0),
});

export const GET = async (request: Request) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get("limit") ?? "30", 10)),
  );
  const sectionParam = url.searchParams.get("section");
  const sectionResult = sectionParam ? sectionEnum.safeParse(sectionParam) : null;
  const sectionFilter = sectionResult?.success ? sectionResult.data : null;
  const where = sectionFilter
    ? eq(galleryImages.section, sectionFilter)
    : undefined;
  const offset = (page - 1) * limit;

  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(galleryImages)
    .where(where);

  const rows = await db
    .select()
    .from(galleryImages)
    .where(where)
    .orderBy(asc(galleryImages.section), asc(galleryImages.sortOrder))
    .limit(limit)
    .offset(offset);

  return NextResponse.json({
    data: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.max(1, Math.ceil(count / limit)),
    },
  });
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
