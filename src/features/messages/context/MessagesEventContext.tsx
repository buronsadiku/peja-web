"use client";

import { createContext, useContext, type ReactNode } from "react";

const MessagesEventContext = createContext<string | null>(null);

export const MessagesEventProvider = ({
  eventId,
  children,
}: {
  eventId: string;
  children: ReactNode;
}) => (
  <MessagesEventContext.Provider value={eventId}>
    {children}
  </MessagesEventContext.Provider>
);

export const useEventId = () => {
  const id = useContext(MessagesEventContext);
  if (!id)
    throw new Error("useEventId must be used inside MessagesEventProvider");
  return id;
};
