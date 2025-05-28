import { format } from "date-fns";
import { Event } from "../types/types";

export const filterEvents = (events: Event[], searchQuery: string) => {
  if (!searchQuery) return events;

  const lowercasedQuery = searchQuery.toLowerCase();

  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(lowercasedQuery) ||
      event.hostedBy.toLowerCase().includes(lowercasedQuery)
  );
};

export const getTodaysEvents = (events: Event[]): Event[] => {
  const today = format(new Date(), "d");

  return events.filter((event) => event.date === today);
};
