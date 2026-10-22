import { API_URL, api } from './api';
export async function getMyEventRegistration() { const result = await api('/event-registrations/mine'); return result.data; }
export class SubmissionError extends Error {
  constructor(message, status, errors = {}) {
    super(message);
    this.name = 'SubmissionError';
    this.status = status;
    this.errors = errors;
  }
}

export async function submitEventRegistration(payload) {
  const body = new FormData();
  Object.entries(payload).forEach(([key,value]) => {
    if (value == null) return;
    if (key === 'interests') value.forEach(item => body.append('interests', item));
    else body.append(key, value);
  });
  let response;
  try {
    response = await fetch(`${API_URL}/event-registrations`, { method:'POST', body, credentials:'include' });
  } catch {
    throw new SubmissionError('We could not connect while uploading. Check your connection and try again.');
  }
  const contentType = response.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    try { data = await response.json(); } catch { /* An upstream may return malformed JSON. */ }
  }
  if (!response.ok) {
    const fallback = {
      400: 'Please check the highlighted fields and try again.',
      403: 'This request was blocked. Please reload the page and try again.',
      404: 'The application service could not be found. Please contact support.',
      409: 'You have already submitted an event registration.',
      413: 'Your uploads are too large. Please use a smaller picture or PDF.',
      429: 'Too many attempts. Please wait a few minutes before trying again.',
      502: 'The application service is temporarily unavailable. Please try again shortly.',
      503: 'The application service is temporarily unavailable. Please try again shortly.',
      504: 'The upload timed out. Please try again with smaller files or a stronger connection.',
    }[response.status] || (response.status >= 500
      ? 'We could not save your application right now. Please try again later.'
      : 'We could not submit your application. Please try again.');
    throw new SubmissionError(data?.message || fallback, response.status, data?.errors || {});
  }
  return data;
}
