
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// Get the base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the headers
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const { response } = error;
    
    if (response) {
      const status = response.status;
      
      // Handle 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        localStorage.removeItem('token');
        // Dispatch logout action if using Redux/Context
        
        // Redirect to login
        if (window.location.pathname !== '/login') {
          toast.error('Your session has expired. Please log in again.');
          window.location.href = '/login';
        }
      }
      
      // Handle 403 Forbidden - Not enough permissions
      if (status === 403) {
        toast.error('You do not have permission to perform this action');
        
        // Optionally redirect to a "not authorized" page
        if (window.location.pathname !== '/not-authorized') {
          window.location.href = '/not-authorized';
        }
      }
      
      // Handle 404 Not Found
      if (status === 404) {
        toast.error('The requested resource was not found');
      }
      
      // Handle 500 Internal Server Error
      if (status >= 500) {
        toast.error('An unexpected error occurred. Please try again later');
      }
    } else {
      // Network error
      toast.error('Unable to connect to the server. Please check your internet connection');
    }
    
    return Promise.reject(error);
  }
);

// Generic get function with typing
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await axiosClient.get<T>(url, config);
  return response.data;
};

// Generic post function with typing
export const post = async <T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  const response = await axiosClient.post<T>(url, data, config);
  return response.data;
};

// Generic put function with typing
export const put = async <T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  const response = await axiosClient.put<T>(url, data, config);
  return response.data;
};

// Generic patch function with typing
export const patch = async <T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  const response = await axiosClient.patch<T>(url, data, config);
  return response.data;
};

// Generic delete function with typing
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await axiosClient.delete<T>(url, config);
  return response.data;
};

export default axiosClient;
