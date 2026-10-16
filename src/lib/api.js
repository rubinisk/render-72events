const API_BASE = 'https://render72.pages.dev/api/test';
const DEFAULT_TIMEOUT_MS = 7000;

export class ApiError extends Error {
  constructor(message, { status = 0, isNotFound = false, isRetryable = true } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isNotFound = isNotFound;
    this.isRetryable = isRetryable;
  }
}

/**
 * Fetch with a 7-second timeout and combined abort signal
 */
async function fetchWithTimeout(url, { signal: externalSignal, timeout = DEFAULT_TIMEOUT_MS } = {}) {
  const timeoutController = new AbortController();
  const timer = setTimeout(() => {
    timeoutController.abort(new Error('Request timed out.'));
  }, timeout);

  // Link external signal if provided
  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timer);
      timeoutController.abort(externalSignal.reason);
    } else {
      externalSignal.addEventListener('abort', () => {
        clearTimeout(timer);
        timeoutController.abort(externalSignal.reason);
      }, { once: true });
    }
  }

  try {
    const response = await fetch(url, {
      signal: timeoutController.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timer);

    let data;
    try {
      data = await response.json();
    } catch {
      // Invalid JSON
      if (!response.ok) {
        throw new ApiError(`Server returned error ${response.status}`, {
          status: response.status,
          isNotFound: response.status === 404,
          isRetryable: response.status >= 500,
        });
      }
      throw new ApiError('Invalid response received from server.', {
        status: response.status,
        isNotFound: false,
        isRetryable: true,
      });
    }

    if (!response.ok) {
      const is404 = response.status === 404;
      const errorMessage = data?.message || (is404 ? 'Event not found.' : `Request failed with status ${response.status}`);
      throw new ApiError(errorMessage, {
        status: response.status,
        isNotFound: is404,
        isRetryable: !is404,
      });
    }

    return data;
  } catch (err) {
    clearTimeout(timer);

    if (err instanceof ApiError) {
      throw err;
    }

    // Check if timeout or abort
    if (err.name === 'AbortError' || err.message?.includes('timed out')) {
      // If external signal was aborted intentionally, propagate abort
      if (externalSignal?.aborted) {
        throw err;
      }
      throw new ApiError('Request timed out after 7 seconds. Please check your connection.', {
        status: 408,
        isNotFound: false,
        isRetryable: true,
      });
    }

    // Network error or fetch failure
    throw new ApiError(err.message || 'Network connection failed.', {
      status: 0,
      isNotFound: false,
      isRetryable: true,
    });
  }
}

/**
 * Fetch all events list
 * Handles both bare array or { events: [...] }
 */
export async function fetchEvents({ signal } = {}) {
  const data = await fetchWithTimeout(`${API_BASE}/events`, { signal });
  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray(data.events)) {
    return data.events;
  }
  return [];
}

/**
 * Fetch a single event by ID
 * Handles { event: {...} } or bare object
 */
export async function fetchEventById(id, { signal } = {}) {
  if (!id) {
    throw new ApiError('Event ID is required.', { status: 400, isNotFound: true, isRetryable: false });
  }

  const data = await fetchWithTimeout(`${API_BASE}/events/${encodeURIComponent(id)}`, { signal });
  if (data && typeof data === 'object') {
    if (data.event && typeof data.event === 'object') {
      return data.event;
    }
    return data;
  }
  throw new ApiError('Event data not found.', { status: 404, isNotFound: true, isRetryable: false });
}
