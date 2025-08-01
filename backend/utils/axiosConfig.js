import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Request interceptor to add authentication headers
apiClient.interceptors.request.use(
  (config) => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    const username = userData?.username;

    if (username) {
      config.headers['x-username'] = username;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if authentication fails
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default apiClient;