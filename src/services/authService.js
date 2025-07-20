import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management functions
export const setToken = (token) => {
  if (token) {
    localStorage.setItem('jwt_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export const getToken = () => {
  return localStorage.getItem('jwt_token');
};

export const removeToken = () => {
  localStorage.removeItem('jwt_token');
  delete api.defaults.headers.common['Authorization'];
};

export const isAuthenticated = () => {
  const token = getToken();
  const expiry = localStorage.getItem('token_expiry');
  if (!token || !expiry) return false;
  return Date.now() < Number(expiry);
};

// Axios interceptor to automatically add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login for 401s if not on update-password endpoint
    if (
      error.response?.status === 401 &&
      !(error.config && error.config.url && error.config.url.includes('/user/update-password'))
    ) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const login = async (email, password) => {
  try {
    const response = await api.post('/user/login', { email, password });
    const { token, user } = response.data;
    
    if (token) {
      setToken(token);
    }
    
    return { user, token };
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  removeToken();
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_type');
  localStorage.removeItem('student_id');
  localStorage.removeItem('token_expiry');
};

export const getCurrentUser = () => {
  const userEmail = localStorage.getItem('user_email');
  const studentId = localStorage.getItem('student_id');
  const userType = localStorage.getItem('user_type');
  return { email: userEmail, studentId, userType };
};

export default api; 