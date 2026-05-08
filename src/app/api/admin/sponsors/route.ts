import { NextResponse } from "next/server";
import { asc, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { sponsors } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const createSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().url(),
  url: z.string().url().nullable().optional(),
  tier: z.enum(["gold", "silver", "bronze"]).default("bronze"),
  sortOrder: z.number().int().default(0),
});

export const GET = async (request: Request) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const data = await db
    .select()
    .from(sponsors)
    .orderBy(
      sql`CASE ${sponsors.tier} WHEN 'gold' THEN 1 WHEN 'silver' THEN 2 WHEN 'bronze' THEN 3 END`,
      asc(sponsors.sortOrder),
    );
  return NextResponse.json({ data });
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

  const [created] = await db.insert(sponsors).values(parsed.data).returning();
  return NextResponse.json({ data: created }, { status: 201 });
};
