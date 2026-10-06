"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useLogin } from "./useLogin";

/**
 * Admin sign-in, styled to match the Varona Academy website:
 * deep-purple primary (#7047EB), clean cool-white surfaces, rounded inputs,
 * a pill primary action, and a gradient brand panel with a subtle grid.
 */
export const LoginView = () => {
  const { form, onSubmit, loading, error } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fafaff] text-[#1e1b2e]">
      {/* Left: form */}
      <div className="flex w-full flex-col justify-center px-6 sm:px-10 lg:w-1/2 lg:px-[8%]">
        <div className="mx-auto w-full max-w-[420px]">
          <div className="mb-8 flex items-center gap-3">
            <Image
              src="/images/logo-image.png"
              alt="Varona Academy"
              width={160}
              height={64}
              className="h-12 w-auto object-contain"
              priority
              unoptimized
            />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#7047EB]">
              Admin
            </span>
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-[#1e1b2e]">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-[#6b6880]">
            Sign in to the Varona Academy administration dashboard.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-10 flex flex-col gap-5"
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1e1b2e]">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b97ad]" />
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-[#e6e3f0] bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-[#b4b0c4] focus:border-[#7047EB] focus:ring-4 focus:ring-[#7047EB]/10"
                />
              </div>
              {errors.email && (
                <span className="text-xs font-medium text-red-500">
                  {errors.email.message as string}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1e1b2e]">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b97ad]" />
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="*********"
                  className="w-full rounded-xl border border-[#e6e3f0] bg-white py-3 pl-11 pr-11 text-sm tracking-widest outline-none transition-all placeholder:text-[#b4b0c4] focus:border-[#7047EB] focus:ring-4 focus:ring-[#7047EB]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9b97ad] transition-colors hover:text-[#7047EB]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs font-medium text-red-500">
                  {errors.password.message as string}
                </span>
              )}
            </div>

            {/* Row */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[#6b6880]">
                <input
                  type="checkbox"
                  onChange={(e) => form.setValue("rememberMe", e.target.checked)}
                  className="h-4 w-4 rounded border-[#d6d2e4] text-[#7047EB] accent-[#7047EB]"
                />
                Remember me
              </label>
              <span className="cursor-pointer text-sm font-semibold text-[#7047EB] hover:underline">
                Forgot password
              </span>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#7047EB] font-bold text-white shadow-lg shadow-[#7047EB]/25 transition-all hover:bg-[#5f37d4] hover:shadow-[#7047EB]/35 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right: brand panel */}
      <div className="relative hidden lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center overflow-hidden bg-gradient-to-br from-[#7047EB] via-[#5f37d4] to-[#3a1d8a] p-12">
        {/* Subtle grid overlay, echoing the website hero */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {/* Glow accents */}
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#b026a9]/40 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[#ffd36b]/20 blur-3xl" />

        <div className="relative z-10 max-w-md text-center">
          <div className="mx-auto mb-8 flex h-24 items-center justify-center rounded-2xl bg-white/95 px-6 backdrop-blur-md ring-1 ring-white/20">
            <Image
              src="/images/logo-image.png"
              alt="Varona Academy"
              width={200}
              height={80}
              className="h-14 w-auto object-contain"
              unoptimized
            />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white drop-shadow">
            Varona Academy
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/75">
            Manage courses, instructors, students, payments, and system
            analytics — all from one centralized dashboard.
          </p>

          <div className="mt-10 flex items-center justify-center gap-6 text-white/60">
            <div className="text-center">
              <p className="text-2xl font-black text-white">Secure</p>
              <p className="text-[11px] uppercase tracking-widest">Access</p>
            </div>
            <span className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-black text-white">Realtime</p>
              <p className="text-[11px] uppercase tracking-widest">Insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
