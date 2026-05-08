import type { Activity } from "@/features/marketing/data/activities";

type ActivityCheckboxItemProps = {
  activity: Activity;
  checked: boolean;
  onToggle: (id: string, next: boolean) => void;
};

export const ActivityCheckboxItem = ({
  activity,
  checked,
  onToggle,
}: ActivityCheckboxItemProps) => {
  return (
    <label className="flex items-start gap-4 p-4 bg-background border border-border rounded-xl cursor-pointer hover:border-primary transition-all group">
      <div className="flex items-center h-6 mt-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onToggle(activity.id, e.target.checked)}
          className="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
        />
      </div>
      <div className="flex-1">
        <p className="font-bold text-lg group-hover:text-primary transition-colors">
          {activity.name}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
          <span>📅 {activity.date}</span>
          <span>🕐 {activity.time}</span>
          <span>📍 {activity.location}</span>
        </div>
      </div>
    </label>
  );
};
