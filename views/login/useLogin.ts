import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import authService from "../../services/auth";
import { useForm } from "react-hook-form";

export const useLogin = () => {
  const storeLogin = useAuthStore((state) => state.login);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    // Calls POST /api/v1/auth/admin/login
    mutationFn: (data: any) =>
      authService.loginApi({
        email: data.email,
        password: data.password,
      }),
    onSuccess: (res) => {
      // Save real JWT tokens + user to store (also sets cookies)
      storeLogin(res.data.user, res.data.tokens.accessToken, res.data.tokens.refreshToken);

      // Redirect to admin dashboard
      router.push("/");
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch {
      // Surfaced through `error` below.
    }
  };

  // A new submit resets the mutation, which clears the previous error.
  const loading = loginMutation.isPending;
  const loginError = loginMutation.error as any;
  const error: string | null = loginError
    ? loginError?.response?.data?.message ||
      "Invalid credentials. Please try again."
    : null;

  return {
    form,
    onSubmit,
    loading,
    error,
  };
};
