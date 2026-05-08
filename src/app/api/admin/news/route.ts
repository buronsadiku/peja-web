import { NextResponse } from "next/server";
import { desc, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { newsPosts } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const createSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters/numbers/dashes"),
  title: z.string().min(1),
  body: z.string().min(1),
  imageUrl: z.string().nullable().optional(),
  pinned: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
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
  const offset = (page - 1) * limit;

  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(newsPosts);

  const data = await db
    .select()
    .from(newsPosts)
    .orderBy(desc(newsPosts.pinned), desc(newsPosts.publishedAt))
    .limit(limit)
    .offset(offset);

  return NextResponse.json({
    data,
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

  const insertValues = {
    ...parsed.data,
    publishedAt: parsed.data.publishedAt
      ? new Date(parsed.data.publishedAt)
      : new Date(),
    expiresAt: parsed.data.expiresAt
      ? new Date(parsed.data.expiresAt)
      : null,
  };

  const [created] = await db.insert(newsPosts).values(insertValues).returning();
  return NextResponse.json({ data: created }, { status: 201 });
};
