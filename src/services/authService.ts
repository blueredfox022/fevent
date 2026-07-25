import api from "./api";

export const login = async (username: string, password: string) => {
  const response = await api.post("/admin/login", {
    username,
    password,
  });

  return response.data;
};
