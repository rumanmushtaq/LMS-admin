// import axios, {
//   AxiosInstance,
//   InternalAxiosRequestConfig,
//   AxiosResponse,
//   AxiosError,
// } from "axios";
// import Cookies from "js-cookie";
// import apiEndpoints from "./apiConfig";


// interface ErrorResponseData {
//   message?: string; // Define the `message` property as optional
// }

// export const HTTP_CLIENT_INSTANCE: AxiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
// });

// export const setupAxios = () => {
//   // Request interceptor
//   HTTP_CLIENT_INSTANCE.interceptors.request.use(
//     (config: InternalAxiosRequestConfig) => {
//       const accessToken = Cookies.get("access_token");
//       const refreshToken = Cookies.get("refresh_token");

//       console.log("accessToken", accessToken)
//       console.log("refreshToken", refreshToken)
//       const { LOGIN } = apiEndpoints.Auth;
//       const { STUDENTS } = apiEndpoints.Students;
//       const publicEndpoints = [LOGIN, STUDENTS];
//       const isPublicEndpoint = publicEndpoints.some((endpoint) =>
//         config.url?.includes(endpoint),
//       );
      
//       // Debug logging for every request
//       console.log('🔍 API Request:', {
//         url: config.url,
//         isPublicEndpoint,
//         hasAccessToken: !!accessToken,
//         hasRefreshToken: !!refreshToken,
//       });
      
//       // Send Authorization header if we have an access token
//       if (accessToken && !isPublicEndpoint) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//         console.log('✅ Authorization header added');
//       } else if (!accessToken && !isPublicEndpoint) {
//         console.error('❌ NO ACCESS TOKEN - Request will likely fail with 401');
//       }
      
//       if (!(config.data instanceof FormData)) {
//         config.headers["Content-Type"] = "application/json";
//       } else {
//         // Let Axios set the correct multipart/form-data
//         delete config.headers["Content-Type"];
//       }
//       return config;
//     },
//     (error: unknown) => {
//       console.error("Request error: ", error);
//       //   toast.error("Failed to send the request. Please try again.");
//       return Promise.reject(error);
//     },
//   );

//   // Response interceptor
//   HTTP_CLIENT_INSTANCE.interceptors.response.use(
//     (response: AxiosResponse) => {
//       return response;
//     },
//     (error: AxiosError<ErrorResponseData>) => {
//       console.error("Response error: ", error);

//       if (error.response) {
//         const status = error.response.status;
//         const message = error.response.data?.message || "An error occurred.";

//         if (status === 401) {
//           // Unauthorized error: Redirect to login
//           console.error("🔴 401 Unauthorized - Token issue detected");
//           console.log("Access token exists:", !!Cookies.get("access_token"));
//           console.log("Refresh token exists:", !!Cookies.get("refresh_token"));
          
//           // toast.error("Session expired. Please log in again.");
//           console.log("Redirecting to login page...");
//           window.location.href = "/login";
//         } else if (status >= 400 && status < 500) {
//           if (typeof window !== "undefined") {
//             window.dispatchEvent(
//               new CustomEvent("api-error", {
//                 detail: {
//                   variant: "destructive",
//                   title: "Error",
//                   description: message,
//                 },
//               }),
//             );
//           }
//         } else if (status >= 500) {
//           // Server-side errors
//           // toast.error("Server error. Please try again later.");
//           console.log("Server error. Please try again later.");
//         }
//       } else if (error.request) {
//         // Network or no response errors
//         // toast.error("Network error. Please check your connection.");
//         console.log("Network error. Please check your connection.");
//       } else {
//         // Unknown error
//         // toast.error("An unexpected error occurred.");
//         console.log("An unexpected error occurred.");
//       }

//       return Promise.reject(error);
//     },
//   );

//   return HTTP_CLIENT_INSTANCE;
// };

// export const HTTP_CLIENT = setupAxios();



import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import Cookies from "js-cookie";
import apiEndpoints from "./apiConfig";

interface ErrorResponseData {
  message?: string;
}

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const HTTP_CLIENT_INSTANCE: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

export const setupAxios = () => {
  // -------------------------
  // REQUEST INTERCEPTOR
  // -------------------------
  HTTP_CLIENT_INSTANCE.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = Cookies.get("access_token");

      const { LOGIN } = apiEndpoints.Auth;

      const publicEndpoints = [LOGIN];

      const isPublicEndpoint = publicEndpoints.some((endpoint) =>
        config.url?.includes(endpoint),
      );

      console.log("🔍 Request:", config.url);

      if (accessToken && !isPublicEndpoint) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log("✅ Access token attached");
      }

      if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
      } else {
        delete config.headers["Content-Type"];
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // -------------------------
  // RESPONSE INTERCEPTOR
  // -------------------------
  HTTP_CLIENT_INSTANCE.interceptors.response.use(
    (response: AxiosResponse) => response,

    async (error: AxiosError<ErrorResponseData>) => {
      const originalRequest = error.config as RetryRequestConfig;

      if (!error.response) {
        console.error("Network error");
        return Promise.reject(error);
      }

      const status = error.response.status;

      // -------------------------
      // HANDLE 401 TOKEN EXPIRED
      // -------------------------
      if (status === 401 && !originalRequest._retry) {
        const refreshToken = Cookies.get("refresh_token");

        if (!refreshToken) {
          console.log("❌ No refresh token, redirecting to login");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return HTTP_CLIENT_INSTANCE(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          console.log("🔄 Refreshing access token...");

          // const response = await axios.post(
          //   `${process.env.NEXT_PUBLIC_API_URL}${apiEndpoints.Auth.REFRESH}`,
          //   {
          //     refresh_token: refreshToken,
          //   },
          // );

          // const newAccessToken = response.data.access_token;

          // Cookies.set("access_token", newAccessToken);

          // HTTP_CLIENT_INSTANCE.defaults.headers.common[
          //   "Authorization"
          // ] = `Bearer ${newAccessToken}`;

          // processQueue(null, newAccessToken);

          // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // return HTTP_CLIENT_INSTANCE(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);

          Cookies.remove("access_token");
          Cookies.remove("refresh_token");

          console.log("❌ Refresh failed, redirecting to login");

          window.location.href = "/login";

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // -------------------------
      // OTHER ERRORS
      // -------------------------
      if (status >= 400 && status < 500) {
        console.error("Client Error:", error.response.data?.message);
      }

      if (status >= 500) {
        console.error("Server Error");
      }

      return Promise.reject(error);
    },
  );

  return HTTP_CLIENT_INSTANCE;
};

export const HTTP_CLIENT = setupAxios();