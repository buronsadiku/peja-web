"use client";

import { ExternalLink, MapPin } from "lucide-react";

type MeetingPointMapProps = {
  latitude: string | null;
  longitude: string | null;
  address: string | null;
  meetingPoint: string | null;
  location: string | null;
};

export const MeetingPointMap = ({
  latitude,
  longitude,
  address,
  meetingPoint,
  location,
}: MeetingPointMapProps) => {
  const lat = latitude ? parseFloat(latitude) : null;
  const lng = longitude ? parseFloat(longitude) : null;
  const hasCoords =
    lat !== null && lng !== null && !Number.isNaN(lat) && !Number.isNaN(lng);

  const mapsUrl = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : null;

  const embedUrl = hasCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005},${lat - 0.005},${lng + 0.005},${lat + 0.005}&layer=mapnik&marker=${lat},${lng}`
    : null;

  if (!hasCoords && !address && !meetingPoint && !location) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-6 space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 text-primary mt-1" />
          <div>
            {meetingPoint ? (
              <p className="font-bold text-lg">{meetingPoint}</p>
            ) : null}
            {location ? (
              <p className="text-muted-foreground">{location}</p>
            ) : null}
            {address ? (
              <p className="text-sm text-muted-foreground">{address}</p>
            ) : null}
          </div>
        </div>
        {mapsUrl ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open in Google Maps
          </a>
        ) : null}
      </div>

      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full h-72 border-0"
          loading="lazy"
          title="Meeting point map"
        />
      ) : null}
    </div>
  );
};
