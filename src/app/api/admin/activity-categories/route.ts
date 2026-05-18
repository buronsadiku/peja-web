import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { activityCategories } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const createSchema = z.object({
  value: z
    .string()
    .min(1)
    .max(40)
    .regex(
      /^[a-z][a-z0-9_-]*$/,
      "value must be lowercase letters/numbers/_/-, start with a letter",
    ),
  labelEn: z.string().min(1).max(80),
  labelSq: z.string().max(80).nullable().optional(),
  sortOrder: z.number().int().optional().default(0),
});

export const GET = async (request: Request) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const rows = await db
    .select()
    .from(activityCategories)
    .orderBy(
      asc(activityCategories.sortOrder),
      asc(activityCategories.labelEn),
    );

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

  try {
    const [created] = await db
      .insert(activityCategories)
      .values(parsed.data)
      .returning();
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("unique") || message.includes("duplicate")) {
      return NextResponse.json(
        { message: "category value already exists" },
        { status: 409 },
      );
    }
    throw err;
  }
};
