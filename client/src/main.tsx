import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
    if (error instanceof Error && error.message.includes('fetch')) {
      console.warn('[Network Error] API connection failed, retrying...');
    }
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
    if (error instanceof Error && error.message.includes('fetch')) {
      console.warn('[Network Error] API connection failed');
    }
  }
});

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]', event.reason);
  event.preventDefault();
});

// Global error handler for runtime errors
window.addEventListener('error', (event) => {
  console.error('[Global Error]', event.error);
});

// Determine API URL safely - always use relative path for same-origin requests
const getApiUrl = (): string => {
  // Always use relative path in browser to avoid CORS and URL validation issues
  return '/api/trpc';
};

// Validate and sanitize URL to prevent Invalid URL errors
const validateUrl = (url: string): string => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    console.error('[API URL Error] URL is empty, using fallback');
    return '/api/trpc';
  }

  try {
    // For relative URLs, construct full URL for validation
    if (url.startsWith('/')) {
      new URL(url, window.location.origin);
    } else {
      new URL(url);
    }
    return url;
  } catch (error) {
    console.error('[API URL Error] Invalid URL:', url, error);
    return '/api/trpc';
  }
};

const apiUrl = validateUrl(getApiUrl());

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: apiUrl,
      transformer: superjson,
      fetch(input, init) {
        // Ensure input is a valid URL string
        if (typeof input !== 'string' || !input) {
          throw new Error('[Fetch Error] Invalid URL provided to fetch');
        }

        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
