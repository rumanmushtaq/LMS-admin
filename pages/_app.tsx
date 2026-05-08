import "../styles/globals.css";
import "react-quill/dist/quill.snow.css";
import type { AppProps } from "next/app";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Layout } from "../components/layout/layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/router";

const lightTheme = createTheme({
  type: "light",
  theme: {
    colors: {
      primary: "#7047EB",
      primaryLight: "#f3e8ff",
      sidebarBg: "#ffffff",
      sidebarActive: "rgba(112, 71, 235, 0.08)",
      sidebarText: "#4b5563",
    },
  },
});

const darkTheme = createTheme({
  type: "dark",
  theme: {
    colors: {
      primary: "#7047EB",
      primaryLight: "#f3e8ff",
      sidebarBg: "#ffffff",
      sidebarActive: "rgba(112, 71, 235, 0.08)",
      sidebarText: "#4b5563",
      dangerLight: "#ffe4e6",
      dangerLightHover: "#fecdd3",
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        defaultTheme="light"
        attribute="class"
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}
      >
        <NextUIProvider>
          {router.pathname === "/login" ? (
            <Component {...pageProps} />
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </NextUIProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
