"use client";

import type { EventStats, InvitationStats } from "@/lib/api/types";
import { GuestDirectory } from "./components/GuestDirectory";
import { GuestHero } from "./components/GuestHero";
import { GuestStatBar } from "./components/GuestStatBar";
import { InvitationFunnelCard } from "./components/InvitationFunnelCard";
import { useGuestList } from "./hooks/useGuestList";

type GuestsPageClientProps = {
  eventId: string;
  stats: EventStats | null;
  invitations: InvitationStats | null;
  inviteUrl: string;
};

export const GuestsPageClient = ({
  eventId,
  stats,
  invitations,
  inviteUrl,
}: GuestsPageClientProps) => {
  const { guests, isPending, isError, isFetchingAll } = useGuestList(eventId);

  const totalGuests = guests.length;

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="tablet:p-6 flex flex-col gap-6 p-4">
        <GuestHero
          totalMessages={stats?.totalMessages ?? 0}
          totalGuests={totalGuests}
          totalInvited={invitations?.totals.sent ?? 0}
          inviteUrl={inviteUrl}
        />
        {stats && <GuestStatBar stats={stats} invitations={invitations} />}

        <GuestDirectory
          guests={guests}
          isPending={isPending}
          isError={isError}
          isFetchingAll={isFetchingAll}
        />
      </div>
    </div>
  );
};
