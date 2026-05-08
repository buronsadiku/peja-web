"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

const calc = (target: Date) => {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
};

export const Countdown = () => {
  const daysQuery = useQuery({
    queryKey: ["festival-days"],
    queryFn: () => api.activities.festivalDays(),
  });

  const startDate = daysQuery.data?.[0]?.date ?? null;

  const [time, setTime] = useState<ReturnType<typeof calc>>(null);

  useEffect(() => {
    if (!startDate) return;
    const target = new Date(startDate + "T00:00:00");
    const tick = () => setTime(calc(target));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [startDate]);

  if (!startDate || !time) return null;

  const cells = [
    { value: time.days, label: "Days" },
    { value: time.hours, label: "Hours" },
    { value: time.minutes, label: "Min" },
    { value: time.seconds, label: "Sec" },
  ];

  return (
    <div className="flex justify-center gap-3 md:gap-6 mt-6">
      {cells.map((c) => (
        <div
          key={c.label}
          className="bg-card/40 backdrop-blur border border-primary/40 rounded-xl px-4 py-3 min-w-20 text-center"
        >
          <p className="text-3xl md:text-5xl font-black text-primary leading-none tabular-nums">
            {String(c.value).padStart(2, "0")}
          </p>
          <p className="text-xs uppercase text-white/70 tracking-wider mt-1">
            {c.label}
          </p>
        </div>
      ))}
    </div>
  );
};
