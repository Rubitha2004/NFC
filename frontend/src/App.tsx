import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { queryClient } from "@/services/queryClient";
import { AppRouter } from "@/routes";
import { LoadingScreen } from "@/shared/components/LoadingScreen";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loading screen on app start
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="factory-os-theme"
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {/* Premium loading screen on app init */}
          <LoadingScreen isVisible={isLoading} />
          
          {!isLoading && <AppRouter />}
        </BrowserRouter>
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
