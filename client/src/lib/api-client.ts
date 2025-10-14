import Axios, { type InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { env } from 'src/config/env';
import { refreshToken } from './auth';
import { useAuthStore } from 'src/features/auth/store/auth-store';

let isRefreshing = false;
let isRetry = false;
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
    const originalRequest = error.config;
    const message = error.response?.data?.message || error.message;

    if (error.response?.status === 422) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      toast.error(message);
      return Promise.reject(error);
    }

    if (isRetry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;
    isRetry = true;

    try {
      await refreshToken();

      onRefreshed();

      return api(originalRequest);
    } catch (refreshError) {
      const { logout } = useAuthStore.getState();
      logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
      isRetry = false;
    }
  },
);
