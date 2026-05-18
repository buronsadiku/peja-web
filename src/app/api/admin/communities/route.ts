import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { communities } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const createSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters/numbers/dashes"),
  logoUrl: z.string().url(),
  descriptionEn: z.string().min(1),
  descriptionSq: z.string().nullable().optional(),
  sortOrder: z.number().int().optional().default(0),
});

export const GET = async (request: Request) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const rows = await db
    .select()
    .from(communities)
    .orderBy(asc(communities.sortOrder), asc(communities.name));

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

  const [created] = await db
    .insert(communities)
    .values(parsed.data)
    .returning();
  return NextResponse.json({ data: created }, { status: 201 });
};
