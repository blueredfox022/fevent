import api from "./api";

export const sendCertificatesByEvent = async (eventId: string | number) => {
  const response = await api.post(`/events/${eventId}/certificates/send`);
  return response.data;
};
