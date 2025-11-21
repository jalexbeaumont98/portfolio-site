// client/src/api/auth.js
const API_BASE = import.meta.env.VITE_API_BASE || '';

function jsonHeaders(extra = {}) {
  return {
    'Content-Type': 'application/json',
    ...extra,
  };
}

// POST /api/auth/signup
export async function signup({ name, email, password }) {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to sign up');
  }

  return res.json(); // { _id, name, email } (from your controller)
}

// POST /api/auth/signin
export async function signin({ email, password }) {
  const res = await fetch(`${API_BASE}/api/auth/signin`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to sign in');
  }

  // your controller returns { token, user: { _id, name, email, role? } }
  return res.json();
}

// GET /api/auth/signout
export async function signout() {
  // backend doesn’t *need* to do anything special if we’re using tokens,
  // but this matches your existing route
  await fetch(`${API_BASE}/api/auth/signout`, {
    method: 'GET',
  }).catch(() => {});
}