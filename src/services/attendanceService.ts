import api from "./api";

type ScanAttendancePayload = {
  qr_token: string;
  event_id: string | number;
};

export const scanAttendance = async ({
  qr_token,
  event_id,
}: ScanAttendancePayload) => {
  const response = await api.post("/attendance/scan", {
    qr_token,
    qr_url: qr_token,
    event_id,
  });

  return response.data;
};
