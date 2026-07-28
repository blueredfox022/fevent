import api from "./api";

export const createCertificate = async (participantId: number) => {
  const response = await api.post(`/participants/${participantId}/certificate`);

  return response.data;
};

export const checkCertificate = async (nim: string) => {
  const response = await api.get(`/certificate/${nim}`);

  return response.data;
};
