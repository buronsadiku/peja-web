import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { festivalDays } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const createSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  label: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
});

export const GET = async (request: Request) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const rows = await db
    .select()
    .from(festivalDays)
    .orderBy(asc(festivalDays.sortOrder), asc(festivalDays.date));
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
      .insert(festivalDays)
      .values(parsed.data)
      .returning();
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message.includes("unique")) {
      return NextResponse.json(
        { message: "this date already exists" },
        { status: 409 },
      );
    }
    throw err;
  }
};
