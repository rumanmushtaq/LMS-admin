import { useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "../../store/authStore";
import authService from "../../services/auth";
import { useForm } from "react-hook-form";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storeLogin = useAuthStore((state) => state.login);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      // Calls POST /api/v1/auth/admin/login
      const res = await authService.loginApi({
        email: data.email,
        password: data.password,
      });

      // Save real JWT tokens + user to store (also sets cookies)
      storeLogin(res.data.user, res.data.tokens.accessToken, res.data.tokens.refreshToken);

      // Redirect to admin dashboard
      router.push("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Invalid credentials. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    loading,
    error,
  };
};
