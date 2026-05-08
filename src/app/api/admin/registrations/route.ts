import { NextResponse } from "next/server";
import {
  and,
  desc,
  eq,
  exists,
  ilike,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  activityOccurrences,
  activityTemplates,
  registrationActivities,
  registrations,
} from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

export const GET = async (request: Request) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    500,
    Math.max(1, parseInt(url.searchParams.get("limit") ?? "100", 10)),
  );
  const q = (url.searchParams.get("q") ?? "").trim();
  const occurrenceId = url.searchParams.get("occurrenceId");
  const date = url.searchParams.get("date");
  const offset = (page - 1) * limit;

  const filters: SQL[] = [];
  if (q) {
    const like = `%${q}%`;
    const orCondition = or(
      ilike(registrations.email, like),
      ilike(registrations.fullName, like),
      ilike(registrations.phone, like),
    );
    if (orCondition) filters.push(orCondition);
  }
  if (occurrenceId) {
    filters.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(registrationActivities)
          .where(
            and(
              eq(registrationActivities.registrationId, registrations.id),
              eq(registrationActivities.occurrenceId, occurrenceId),
            ),
          ),
      ),
    );
  }
  if (date) {
    filters.push(eq(registrations.date, date));
  }

  const where = filters.length ? and(...filters) : undefined;

  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(registrations)
    .where(where);

  const rows = await db
    .select({
      id: registrations.id,
      email: registrations.email,
      fullName: registrations.fullName,
      phone: registrations.phone,
      date: registrations.date,
      responsibilityAccepted: registrations.responsibilityAccepted,
      notifyIfAbsent: registrations.notifyIfAbsent,
      createdAt: registrations.createdAt,
      activities: sql<
        Array<{ id: string; name: string; startTime: string; endTime: string }>
      >`COALESCE(
          json_agg(
            json_build_object(
              'id', ${activityOccurrences.id},
              'name', ${activityTemplates.name},
              'startTime', ${activityOccurrences.startTime},
              'endTime', ${activityOccurrences.endTime}
            )
          ) FILTER (WHERE ${activityOccurrences.id} IS NOT NULL),
          '[]'::json
        )`.as("activities"),
    })
    .from(registrations)
    .leftJoin(
      registrationActivities,
      eq(registrationActivities.registrationId, registrations.id),
    )
    .leftJoin(
      activityOccurrences,
      eq(activityOccurrences.id, registrationActivities.occurrenceId),
    )
    .leftJoin(
      activityTemplates,
      eq(activityTemplates.id, activityOccurrences.templateId),
    )
    .where(where)
    .groupBy(registrations.id)
    .orderBy(desc(registrations.createdAt))
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
