"use strict";
exports.id = 63;
exports.ids = [63];
exports.modules = {

/***/ 4116:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const apiEndpoints = {
    Auth: {
        LOGIN: "/api/v1/auth/admin/login",
        REGISTER: "/api/v1/auth/signup",
        VERIFY_EMAIL: "/api/v1/auth/verify-email",
        RESEND_VERIFICATION_EMAIL: "/api/v1/auth/resend-verification",
        RESET_PASSWORD: "/api/v1/auth/reset-password",
        FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
        OTP_VERIFICATION: "/api/v1/auth/verify-email",
        CHANGE_PASSWORD: "/api/v1/auth/change-password",
        LOGOUT: "/api/v1/auth/logout",
        REFRESH_TOKEN: "/api/v1/auth/refresh",
        ME: "/api/v1/auth/me",
        TWO_FACTOR_AUTH: "/api/v1/auth/2fa",
        TWO_FACTOR_AUTH_VERIFY: "/api/v1/auth/2fa/verify"
    },
    Admin: {
        DASHBOARD_STATS: "/api/v1/admin/dashboard/stats",
        USERS: "/api/v1/admin/users",
        USER_BY_ID: (id)=>`/api/v1/admin/users/${id}`,
        UPDATE_USER: (id)=>`/api/v1/admin/users/${id}`,
        UPDATE_USER_STATUS: (id)=>`/api/v1/admin/users/${id}/status`,
        UPDATE_USER_ROLE: (id)=>`/api/v1/admin/users/${id}/role`,
        SUSPEND_USER: (id)=>`/api/v1/admin/users/${id}/suspend`,
        ACTIVATE_USER: (id)=>`/api/v1/admin/users/${id}/activate`,
        DELETE_USER: (id)=>`/api/v1/admin/users/${id}`,
        CREATE_ADMIN: "/api/v1/admin/users/admin"
    },
    Students: {
        // Student endpoints
        STUDENTS: "/api/v1/admin/students",
        STUDENT_BY_ID: (id)=>`/api/v1/admin/students/${id}`,
        UPDATE_STUDENT: (id)=>`/api/v1/admin/students/${id}`,
        UPDATE_STUDENT_STATUS: (id)=>`/api/v1/admin/students/${id}/status`,
        SUSPEND_STUDENT: (id)=>`/api/v1/admin/students/${id}/suspend`,
        ACTIVATE_STUDENT: (id)=>`/api/v1/admin/students/${id}/activate`,
        DELETE_STUDENT: (id)=>`/api/v1/admin/students/${id}`
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (apiEndpoints);


/***/ }),

/***/ 6063:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bV": () => (/* binding */ HTTP_CLIENT)
/* harmony export */ });
/* unused harmony exports HTTP_CLIENT_INSTANCE, setupAxios */
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9648);
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9915);
/* harmony import */ var _apiConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4116);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__, js_cookie__WEBPACK_IMPORTED_MODULE_1__]);
([axios__WEBPACK_IMPORTED_MODULE_0__, js_cookie__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
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



const HTTP_CLIENT_INSTANCE = axios__WEBPACK_IMPORTED_MODULE_0__["default"].create({
    baseURL: "http://localhost:8000"
});
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null)=>{
    failedQueue.forEach((prom)=>{
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};
const setupAxios = ()=>{
    // -------------------------
    // REQUEST INTERCEPTOR
    // -------------------------
    HTTP_CLIENT_INSTANCE.interceptors.request.use((config)=>{
        const accessToken = js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].get("access_token");
        const { LOGIN  } = _apiConfig__WEBPACK_IMPORTED_MODULE_2__/* ["default"].Auth */ .Z.Auth;
        const publicEndpoints = [
            LOGIN
        ];
        const isPublicEndpoint = publicEndpoints.some((endpoint)=>config.url?.includes(endpoint));
        console.log("\uD83D\uDD0D Request:", config.url);
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
    }, (error)=>Promise.reject(error));
    // -------------------------
    // RESPONSE INTERCEPTOR
    // -------------------------
    HTTP_CLIENT_INSTANCE.interceptors.response.use((response)=>response, async (error)=>{
        const originalRequest = error.config;
        if (!error.response) {
            console.error("Network error");
            return Promise.reject(error);
        }
        const status = error.response.status;
        // -------------------------
        // HANDLE 401 TOKEN EXPIRED
        // -------------------------
        if (status === 401 && !originalRequest._retry) {
            const refreshToken = js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].get("refresh_token");
            if (!refreshToken) {
                console.log("❌ No refresh token, redirecting to login");
                window.location.href = "/login";
                return Promise.reject(error);
            }
            if (isRefreshing) {
                return new Promise((resolve, reject)=>{
                    failedQueue.push({
                        resolve,
                        reject
                    });
                }).then((token)=>{
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return HTTP_CLIENT_INSTANCE(originalRequest);
                }).catch((err)=>Promise.reject(err));
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                console.log("\uD83D\uDD04 Refreshing access token...");
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
                js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].remove("access_token");
                js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].remove("refresh_token");
                console.log("❌ Refresh failed, redirecting to login");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally{
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
    });
    return HTTP_CLIENT_INSTANCE;
};
const HTTP_CLIENT = setupAxios();

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;