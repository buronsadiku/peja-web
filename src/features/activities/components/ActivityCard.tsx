import { Clock, MapPin, Users } from "lucide-react";
import type { ActivityListItem } from "@/lib/api/types";

export const ActivityCard = ({
  activity,
}: {
  activity: ActivityListItem;
}) => {
  const isFull = activity.seatsLeft <= 0;
  return (
    <div
      className={`bg-card border rounded-2xl overflow-hidden transition-all group ${
        isFull
          ? "border-border opacity-60"
          : "border-border hover:border-primary hover:shadow-lg hover:shadow-primary/20"
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-2xl font-black group-hover:text-primary transition-colors">
            {activity.name}
          </h3>
          <span
            className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
              isFull
                ? "bg-destructive/20 text-destructive"
                : "bg-primary/20 text-primary"
            }`}
          >
            {isFull ? "Full" : `${activity.seatsLeft}/${activity.capacity}`}
          </span>
        </div>
        {activity.description ? (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {activity.description}
          </p>
        ) : null}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              {activity.startTime.slice(0, 5)} – {activity.endTime.slice(0, 5)}
            </span>
          </div>
          {activity.location ? (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{activity.location}</span>
            </div>
          ) : null}
          {activity.meetingPoint ? (
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                {activity.meetingPoint}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
