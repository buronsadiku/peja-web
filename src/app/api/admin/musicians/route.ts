import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { festivalDays, musicians } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const createSchema = z.object({
  festivalDayId: z.string().uuid(),
  nameEn: z.string().min(1).max(160),
  nameSq: z.string().max(160).nullable().optional(),
  descriptionEn: z.string().nullable().optional(),
  descriptionSq: z.string().nullable().optional(),
  photoUrl: z.string().url(),
  sortOrder: z.number().int().optional().default(0),
  isPublished: z.boolean().optional().default(true),
});

export const GET = async (request: Request) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const rows = await db
    .select({
      id: musicians.id,
      festivalDayId: musicians.festivalDayId,
      festivalDayDate: festivalDays.date,
      festivalDayLabel: festivalDays.label,
      nameEn: musicians.nameEn,
      nameSq: musicians.nameSq,
      descriptionEn: musicians.descriptionEn,
      descriptionSq: musicians.descriptionSq,
      photoUrl: musicians.photoUrl,
      sortOrder: musicians.sortOrder,
      isPublished: musicians.isPublished,
      createdAt: musicians.createdAt,
      updatedAt: musicians.updatedAt,
    })
    .from(musicians)
    .innerJoin(festivalDays, eq(festivalDays.id, musicians.festivalDayId))
    .orderBy(
      asc(festivalDays.sortOrder),
      asc(festivalDays.date),
      asc(musicians.sortOrder),
      asc(musicians.createdAt),
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

  const [created] = await db.insert(musicians).values(parsed.data).returning();
  return NextResponse.json({ data: created }, { status: 201 });
};
