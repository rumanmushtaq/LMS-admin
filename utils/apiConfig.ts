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
    HERO_BANNER: "/api/v1/admin/hero-banner",
    HERO_BANNER_BY_ID: (id: string) => `/api/v1/admin/hero-banner/${id}`,
    UPLOAD_IMAGE: "/api/v1/admin/upload/image",
    UPLOAD_VIDEO: "/api/v1/admin/upload/video",
    APPROVE_TUTOR: (id: string) => `/api/v1/admin/tutors/${id}/approve`,
    REJECT_TUTOR: (id: string) => `/api/v1/admin/tutors/${id}/reject`,
    TUTORS: "/api/v1/admin/tutors",
    TUTOR_BY_ID: (id: string) => `/api/v1/admin/tutors/${id}`,
  },
  Students: {
    // Student endpoints
    STUDENTS: "/api/v1/admin/students",
    STUDENT_BY_ID: (id: string) => `/api/v1/admin/students/${id}`,
    UPDATE_STUDENT: (id: string) => `/api/v1/admin/students/${id}`,
    UPDATE_STUDENT_STATUS: (id: string) =>
      `/api/v1/admin/students/${id}/status`,
    SUSPEND_STUDENT: (id: string) => `/api/v1/admin/students/${id}/suspend`,
    ACTIVATE_STUDENT: (id: string) => `/api/v1/admin/students/${id}/activate`,
    DELETE_STUDENT: (id: string) => `/api/v1/admin/students/${id}`,
  },
  Shop: {
    PRODUCTS: "/api/v1/shop/products",
    ADMIN_PRODUCTS: "/api/v1/shop/admin/products",
    PRODUCT_BY_ID: (id: string) => `/api/v1/shop/products/${id}`,
    CREATE_PRODUCT: "/api/v1/shop/products",
    UPDATE_PRODUCT: (id: string) => `/api/v1/shop/products/${id}`,
    UPDATE_PRODUCT_STATUS: (id: string) => `/api/v1/shop/products/${id}/status`,
    DELETE_PRODUCT: (id: string) => `/api/v1/shop/products/${id}`,
    PERMANENT_DELETE_PRODUCT: (id: string) =>
      `/api/v1/shop/products/${id}/hard`,
    ORDERS: "/api/v1/shop/admin/orders",
  },
  Categories: {
    GET_ALL: "/api/v1/categories",
    GET_BY_ID: (id: string) => `/api/v1/categories/${id}`,
    CREATE: "/api/v1/categories",
    UPDATE: (id: string) => `/api/v1/categories/${id}`,
    DELETE: (id: string) => `/api/v1/categories/${id}`,
  },
  Security: {
    WHOAMI: "/api/v1/admin/security/whoami",
    STATS: "/api/v1/admin/security/stats",
    TIMESERIES: "/api/v1/admin/security/timeseries",
    IPS: "/api/v1/admin/security/ips",
    IP_DETAIL: (ip: string) =>
      `/api/v1/admin/security/ips/${encodeURIComponent(ip)}`,
    BLOCKS: "/api/v1/admin/security/blocks",
    UNBLOCK: (key: string) =>
      `/api/v1/admin/security/blocks/${encodeURIComponent(key)}`,
    WHITELIST: "/api/v1/admin/security/whitelist",
    WHITELIST_REMOVE: (key: string) =>
      `/api/v1/admin/security/whitelist/${encodeURIComponent(key)}`,
    AUDIT: "/api/v1/admin/security/audit",
  },
};

export default apiEndpoints;
