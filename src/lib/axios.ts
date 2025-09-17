import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // relative to Next.js
  withCredentials: true, // so cookies (JWT) are sent
});
