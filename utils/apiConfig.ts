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
    TWO_FACTOR_AUTH_VERIFY: "/api/v1/auth/2fa/verify",
  },
  Admin: {
    DASHBOARD_STATS: "/api/v1/admin/dashboard/stats",
    USERS: "/api/v1/admin/users",
    USER_BY_ID: (id: string) => `/api/v1/admin/users/${id}`,
    UPDATE_USER: (id: string) => `/api/v1/admin/users/${id}`,
    UPDATE_USER_STATUS: (id: string) => `/api/v1/admin/users/${id}/status`,
    UPDATE_USER_ROLE: (id: string) => `/api/v1/admin/users/${id}/role`,
    SUSPEND_USER: (id: string) => `/api/v1/admin/users/${id}/suspend`,
    ACTIVATE_USER: (id: string) => `/api/v1/admin/users/${id}/activate`,
    DELETE_USER: (id: string) => `/api/v1/admin/users/${id}`,
    CREATE_ADMIN: "/api/v1/admin/users/admin",

  },
  Students: {
    
    // Student endpoints
    STUDENTS: "/api/v1/admin/students",
    STUDENT_BY_ID: (id: string) => `/api/v1/admin/students/${id}`,
    UPDATE_STUDENT: (id: string) => `/api/v1/admin/students/${id}`,
    UPDATE_STUDENT_STATUS: (id: string) => `/api/v1/admin/students/${id}/status`,
    SUSPEND_STUDENT: (id: string) => `/api/v1/admin/students/${id}/suspend`,
    ACTIVATE_STUDENT: (id: string) => `/api/v1/admin/students/${id}/activate`,
    DELETE_STUDENT: (id: string) => `/api/v1/admin/students/${id}`,
  },
};

export default apiEndpoints;
