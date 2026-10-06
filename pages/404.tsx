import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { ArrowLeft, Home, Compass } from "lucide-react";

/**
 * Admin 404, styled to match the Varona Academy theme: deep-purple gradient
 * panel, clean surfaces, pill actions.
 */
export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#fafaff] p-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-[#ece9f6] bg-white shadow-xl md:grid-cols-2">
        {/* Left: message */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-6 flex items-center gap-3">
            <Image
              src="/images/logo-image.png"
              alt="Varona Academy"
              width={140}
              height={56}
              className="h-11 w-auto object-contain"
              unoptimized
            />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#7047EB]">
              Admin
            </span>
          </div>

          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#7047EB]">
            Error 404
          </p>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight text-[#1e1b2e]">
            Page not found
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#6b6880]">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
            Check the address, or head back to the dashboard.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#7047EB] px-6 font-bold text-white shadow-lg shadow-[#7047EB]/25 transition-all hover:bg-[#5f37d4]"
            >
              <Home className="h-4 w-4" />
              Go to dashboard
            </Link>
            <button
              onClick={() => router.back()}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#e6e3f0] px-6 font-bold text-[#4b4660] transition-all hover:bg-[#f6f4fc]"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back
            </button>
          </div>
        </div>

        {/* Right: brand panel */}
        <div className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-[#7047EB] via-[#5f37d4] to-[#3a1d8a] p-12 md:flex">
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#b026a9]/40 blur-3xl" />
          <div className="absolute -bottom-20 -right-12 h-72 w-72 rounded-full bg-[#ffd36b]/20 blur-3xl" />

          <div className="relative z-10 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md">
              <Compass className="h-12 w-12 text-white" strokeWidth={1.5} />
            </div>
            <p className="text-7xl font-black tracking-tight text-white drop-shadow">
              404
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/70">
              Lost in space
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
