export type Event = {
  date: string;
  month?: string;
  time: string;
  title: string;
  subtitle?: string;
  tags: string[];
  attendees: string[];
  latitude: number;
  longitude: number;
  id: string;
  distance?: number;
  hostedBy: string;
};
