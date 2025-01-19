import axios from "axios";

// Helper function to get the refresh token from cookies
const getRefreshToken = () => {
  const match = document.cookie.match(/(^| )refreshToken=([^;]+)/);
  if (match) return match[2];
  return null;
};

// Axios instance configuration
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // Replace with your backend base URL
});

// Add request interceptor to include access token in requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response, // If the response is successful, just return it
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token is expired, try refreshing it
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          // Send a request to /auth/refresh to get a new access token
          const response = await axios.post(
            "http://localhost:8000/auth/refresh",
            { refreshToken }
          );

          // Save the new access token in localStorage
          localStorage.setItem("authToken", response.data.accessToken);

          // Retry the original request with the new token
          error.config.headers[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
          return axiosInstance(error.config);
        } catch (err) {
          console.error("Token refresh failed:", err);
          // If refresh failed, log out the user and redirect to login
          window.location.href = "/auth";
        }
      } else {
        // If there's no refresh token, log out the user
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
