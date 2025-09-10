import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1", // your Node.js backend URL
  withCredentials: true, // if you use cookies/session
});

export default api;