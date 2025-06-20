import axios from "axios";

export const axiosInstance = axios.create({
    //baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
    baseURL:import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : import.meta.env.VITE_API_URL + "/api",
    withCredentials: true
})

// export const axiosInstance = axios.create({
//   baseURL: import.meta.env.MODE === "development"
//     ? "http://localhost:5001/api"
//     : "https://real-time-chat-application-gun1.onrender.com/api",
//   withCredentials: true
// });