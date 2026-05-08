import { Clock, MapPin, Users } from "lucide-react";
import type { Activity } from "@/features/marketing/data/activities";

export const ActivityCard = ({ activity }: { activity: Activity }) => {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary transition-all group hover:shadow-lg hover:shadow-primary/20">
      <div className="p-6">
        <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors">
          {activity.name}
        </h3>
        {activity.description ? (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {activity.description}
          </p>
        ) : null}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{activity.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{activity.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              {activity.meetingPoint}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
