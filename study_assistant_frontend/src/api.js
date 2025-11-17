 // PUBLIC_INTERFACE
/**
 * API client for the Academic Query Assistant backend.
 * Uses X-Session-Id header persisted in localStorage to maintain per-session history.
 * Backend base URL is assumed to be http://localhost:3001 (proxy not used).
 */
const BASE_URL = 'http://localhost:3001';

/**
 * Get or create a session id.
 * - If no session id is in localStorage, request /session to obtain one and persist it.
 * - Returns the current session id string.
 */
// PUBLIC_INTERFACE
export async function getSessionId() {
  /** Retrieve or create a session ID via the backend session endpoint */
  let sid = localStorage.getItem('sessionId');
  if (sid && typeof sid === 'string' && sid.trim() !== '') {
    return sid;
  }
  const resp = await fetch(`${BASE_URL}/session`, { method: 'GET' });
  if (!resp.ok) {
    throw new Error(`Failed to create session: ${resp.status}`);
  }
  const data = await resp.json().catch(() => ({}));
  // Try to read from response body; if missing, attempt header
  const newSid = data.session_id || resp.headers.get('X-Session-Id');
  if (!newSid) throw new Error('Backend did not return a session id');
  localStorage.setItem('sessionId', newSid);
  return newSid;
}

/**
 * Get chat history for current session (creates new session if needed).
 * Returns { session_id, messages } where messages is an array.
 */
// PUBLIC_INTERFACE
export async function getHistory() {
  const sid = await getSessionId();
  const resp = await fetch(`${BASE_URL}/history`, {
    method: 'GET',
    headers: {
      'X-Session-Id': sid,
    },
  });
  // If backend creates new, capture the header
  const headerSid = resp.headers.get('X-Session-Id');
  if (headerSid && headerSid !== sid) {
    localStorage.setItem('sessionId', headerSid);
  }
  if (!resp.ok) {
    throw new Error(`Failed to load history: ${resp.status}`);
  }
  return resp.json();
}

/**
 * Send a chat message (question) and return the assistant answer.
 * Returns { session_id, answer } and updates stored session id if backend returns/sets a new one.
 */
// PUBLIC_INTERFACE
export async function sendChatMessage(question) {
  const sid = await getSessionId();
  const resp = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Session-Id': sid,
    },
    body: JSON.stringify({ question }),
  });

  const headerSid = resp.headers.get('X-Session-Id');
  if (headerSid && headerSid !== sid) {
    localStorage.setItem('sessionId', headerSid);
  }

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(text || `Chat request failed: ${resp.status}`);
  }
  return resp.json();
}

/**
 * Reset the current session id in local storage. Useful for manual resets.
 */
// PUBLIC_INTERFACE
export function resetSession() {
  /** Remove stored session ID to force the backend to create a new one on next call */
  localStorage.removeItem('sessionId');
}
