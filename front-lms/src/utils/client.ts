import axios from "axios";

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8002/api",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`, // Include token from localStorage
  },
});

client.defaults.withCredentials = true;
client.defaults.withXSRFToken = true;

export const myClient = client;
