import type { ActivityListItem } from "@/lib/api/types";
import type { DisabledReason } from "../lib/conflicts";

type ActivityCheckboxItemProps = {
  activity: ActivityListItem;
  checked: boolean;
  disabledReason?: DisabledReason;
  onToggle: (id: string, next: boolean) => void;
};

const formatRange = (start: string, end: string) =>
  `${start.slice(0, 5)} – ${end.slice(0, 5)}`;

export const ActivityCheckboxItem = ({
  activity,
  checked,
  disabledReason,
  onToggle,
}: ActivityCheckboxItemProps) => {
  const isDisabled = !!disabledReason;
  const reasonLabel =
    disabledReason?.kind === "full"
      ? "Full"
      : disabledReason?.kind === "conflict"
        ? `Conflicts with "${disabledReason.with.name}" (${formatRange(
            disabledReason.with.startTime,
            disabledReason.with.endTime,
          )})`
        : null;

  return (
    <label
      className={`flex items-start gap-4 p-4 bg-background border rounded-xl transition-all group ${
        isDisabled
          ? "border-border opacity-60 cursor-not-allowed"
          : "border-border cursor-pointer hover:border-primary"
      }`}
    >
      <div className="flex items-center h-6 mt-1">
        <input
          type="checkbox"
          checked={checked}
          disabled={isDisabled}
          onChange={(e) => onToggle(activity.occurrenceId, e.target.checked)}
          className="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 disabled:cursor-not-allowed"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <p
            className={`font-bold text-lg transition-colors ${
              isDisabled ? "" : "group-hover:text-primary"
            }`}
          >
            {activity.name}
          </p>
          <span
            className={`text-xs font-bold uppercase px-2 py-1 rounded-full whitespace-nowrap ${
              activity.seatsLeft <= 0
                ? "bg-destructive/20 text-destructive"
                : "bg-primary/20 text-primary"
            }`}
          >
            {activity.seatsLeft <= 0
              ? "Full"
              : `${activity.seatsLeft}/${activity.capacity}`}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
          <span>🕐 {formatRange(activity.startTime, activity.endTime)}</span>
          {activity.location ? <span>📍 {activity.location}</span> : null}
        </div>
        {reasonLabel ? (
          <p className="mt-2 text-sm text-destructive">{reasonLabel}</p>
        ) : null}
      </div>
    </label>
  );
};
