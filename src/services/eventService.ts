import api from "./api";

export const getEvents = async () => {
  const response = await api.get("/events");

  return response.data;
};
export const getEventDetail = async (id: string) => {
  const response = await api.get(`/events/${id}`);

  return response.data;
};
export const registerParticipant = async (
  eventId: string,
  payload: {
    name: string;
    nim: string;
    email: string;
    phone: string;
    faculty: string;
    department: string;
  },
) => {
  const response = await api.post(`/events/${eventId}/register`, payload);

  return response.data;
};
export const createEvent = async (payload: FormData) => {
  const response = await api.post("/events", payload);

  return response.data;
};
export const getParticipants = async (eventId: string) => {
  const response = await api.get(`/events/${eventId}/participants`);

  return response.data;
};
export const deleteEvent = async (id: number) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

export const updateEvent = async (id: string | number, data: FormData) => {
  const response = await api.post(`/events/${id}?_method=PUT`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
