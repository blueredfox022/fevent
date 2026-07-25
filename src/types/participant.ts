export type Participant = {
  id: number;
  event_id: number;
  name: string;
  nim: string;
  email: string;
  phone?: string | null;
  department?: string | null;
  faculty?: string | null;
  qr_token: string;
  attendance_status: boolean;
};
