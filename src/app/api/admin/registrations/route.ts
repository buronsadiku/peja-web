import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
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
    .groupBy(registrations.id)
    .orderBy(desc(registrations.createdAt));

  return NextResponse.json({ data: rows });
};
