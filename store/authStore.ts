import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import Cookies from "js-cookie";

export type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
};

interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;

  login: (user: AdminUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,

        login: (user, accessToken, refreshToken) => {
          // Save JWT tokens in cookies for the axios interceptor
          Cookies.set("access_token", accessToken, { expires: 1 }); // 1 day
          Cookies.set("refresh_token", refreshToken, { expires: 7 }); // 7 days
          set({ isAuthenticated: true, user, accessToken, refreshToken });
        },

        logout: () => {
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          set({ isAuthenticated: false, user: null, accessToken: null, refreshToken: null });
        },
      }),
      {
        name: "admin-auth-storage",
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        }),
      },
    ),
  ),
);
