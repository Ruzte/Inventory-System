export const getAuthHeaders = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  return {
    "Content-Type": "application/json",
    "x-username": storedUser?.username || ""
  };
};

export const fetchWithAuth = async (url, options = {}) => {
  const defaultOptions = {
    headers: getAuthHeaders(),
    ...options
  };
  
  // If there's a body, merge headers properly
  if (options.headers) {
    defaultOptions.headers = { ...defaultOptions.headers, ...options.headers };
  }
  
  return fetch(url, defaultOptions);
};