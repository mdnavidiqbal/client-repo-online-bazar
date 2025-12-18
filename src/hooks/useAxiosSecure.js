import axios from "axios";

const useAxiosSecure = () => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
  });

  // Request interceptor
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor
  instance.interceptors.response.use(
    res => res,
    err => {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        console.error("Unauthorized! Please login again.");
      }
      return Promise.reject(err);
    }
  );

  return instance;
};

export default useAxiosSecure;
 