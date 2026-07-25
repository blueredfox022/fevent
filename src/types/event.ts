export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  event_date: string;
  quota: number;
  banner?: string | null;
}
