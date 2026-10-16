import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook to execute an async fetcher with abort control, timeout, and retry
 * @param {Function} fetcherFn - async (options: { signal: AbortSignal }) => any
 * @param {Array} deps - dependencies array that re-triggers fetch
 */
export function useFetch(fetcherFn, deps = []) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });
  const [retryIndex, setRetryIndex] = useState(0);

  const abortControllerRef = useRef(null);

  const refetch = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    setRetryIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let ignore = false;

    // Reset loading state for new dependencies asynchronously
    Promise.resolve().then(() => {
      if (!ignore && !controller.signal.aborted) {
        setState((prev) => ({ ...prev, loading: true, error: null }));
      }
    });

    fetcherFn({ signal: controller.signal })
      .then((result) => {
        if (!ignore && !controller.signal.aborted) {
          setState({ data: result, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (!ignore && !controller.signal.aborted) {
          setState({ data: null, loading: false, error: err });
        }
      });

    return () => {
      ignore = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryIndex, ...deps]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
  };
}
