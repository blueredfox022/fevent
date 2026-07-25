import api from "./api";

export const getParticipantsByEvent = async (eventId: string | number) => {
  const response = await api.get(`/events/${eventId}/participants`);
  return response.data;
};
export const getParticipantQr = async (participantId: string | number) => {
  const response = await api.get(`/participants/${participantId}/qr`);
  return response.data;
};
