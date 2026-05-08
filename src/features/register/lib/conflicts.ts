import type { ActivityListItem } from "@/lib/api/types";

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const overlaps = (
  a: { startTime: string; endTime: string },
  b: { startTime: string; endTime: string },
) => {
  return (
    toMinutes(a.startTime) < toMinutes(b.endTime) &&
    toMinutes(b.startTime) < toMinutes(a.endTime)
  );
};

export type DisabledReason =
  | { kind: "full" }
  | { kind: "conflict"; with: ActivityListItem };

export const computeDisabledReasons = (
  activities: ActivityListItem[],
  selectedIds: Set<string>,
): Map<string, DisabledReason> => {
  const disabled = new Map<string, DisabledReason>();

  for (const a of activities) {
    if (selectedIds.has(a.occurrenceId)) continue;

    if (a.seatsLeft <= 0) {
      disabled.set(a.occurrenceId, { kind: "full" });
      continue;
    }

    for (const selectedId of selectedIds) {
      const selected = activities.find(
        (x) => x.occurrenceId === selectedId,
      );
      if (!selected) continue;
      if (overlaps(a, selected)) {
        disabled.set(a.occurrenceId, { kind: "conflict", with: selected });
        break;
      }
    }
  }

  return disabled;
};
