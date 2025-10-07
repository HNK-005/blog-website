import Axios, { type InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { env } from 'src/config/env';
import { refreshToken } from './auth';

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }

  config.withCredentials = true;
  return config;
}

export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const message = error.response?.data?.message || error.message;
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return toast.error(message);
    }

    if (error.response?.status !== 401 || isRefreshing) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Nếu đang refresh → đợi token mới
      return new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      // Gọi API refresh token
      await refreshToken();

      onRefreshed();

      return api(originalRequest);
    } catch (refreshError) {
      // Nếu refresh fail → logout luôn
      toast.error('Your session has expired. Please log in again!');
      sessionStorage.removeItem('user');

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
