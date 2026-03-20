import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {createTheme, NextUIProvider} from '@nextui-org/react';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import {Layout} from '../components/layout/layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/router';

const lightTheme = createTheme({
   type: 'light',
   theme: {
      colors: {},
   },
});

const darkTheme = createTheme({
   type: 'dark',
   theme: {
      colors: {},
   },
});

function MyApp({Component, pageProps}: AppProps) {
   const [queryClient] = useState(() => new QueryClient());
   const router = useRouter();

   return (
      <QueryClientProvider client={queryClient}>
         <NextThemesProvider
            defaultTheme="system"
            attribute="class"
            value={{
               light: lightTheme.className,
               dark: darkTheme.className,
            }}
         >
            <NextUIProvider>
               {router.pathname === '/login' ? (
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
