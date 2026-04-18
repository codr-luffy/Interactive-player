import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function register({ email, username, password }) {
  const responce = await api.post("/api/auth/register", {
    email,
    username,
    password,
  });

  return responce.data;
}

export async function login({ email, username, password }) {
  const responce = await api.post("/api/auth/login", {
    email,
    username,
    password,
  });

  return responce.data;
}

export async function getMe() {
  const responce = await api.get("/api/auth/getMe");
  return responce.data;
}

export async function logout() {
  const responce = await api.get("/api/auth/logout");
  return responce.data;
}
