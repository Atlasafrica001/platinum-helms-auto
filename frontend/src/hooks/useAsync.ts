import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";

export interface AsyncState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

interface UseAsyncOptions {
  /** Run immediately on mount (default: true). */
  immediate?: boolean;
  /** Show a toast when the request fails (default: false — pages often render an inline error instead). */
  toastOnError?: boolean;
}

/**
 * Generic async-data hook with consistent loading / error / data states.
 * Keeps every data fetch in the app on the same lifecycle so loading skeletons
 * and error views behave identically everywhere.
 */
export function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: unknown[] = [],
  options: UseAsyncOptions = {},
) {
  const { immediate = true, toastOnError = false } = options;
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
  });

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await asyncFn();
      if (mounted.current) setState({ data, error: null, isLoading: false });
      return data;
    } catch (err) {
      const message =
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      if (mounted.current) setState((s) => ({ ...s, error: message, isLoading: false }));
      if (toastOnError) toast.error(message);
      return undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (immediate) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, refetch: run, setData: (data: T) => setState((s) => ({ ...s, data })) };
}
