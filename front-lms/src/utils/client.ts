import axios from "axios";

export const client = axios.create({
  baseURL: "http://localhost:8002/api",
  //baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`, // Include token from localStorage
  },
});

client.defaults.withCredentials = true;
client.defaults.withXSRFToken = true;

export const myClient = client;
