// src/api/contacts.js
const API_BASE =
  import.meta.env.VITE_API_BASE || ""; // for localhost use ""

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Create a new contact.
 *
 * Example payload:
 * {
 *   firstname: "Jacob",
 *   lastname: "Beaumont",
 *   email: "jalexbeaumont@gmail.com",
 *   message: "Loved your number guessing project!"
 * }
 */
export async function createContact(payload) {
  const res = await fetch(`${API_BASE}/api/contacts`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to submit contact form");
  }

  return res.json();
}

export async function listContacts(token) {
  const res = await fetch(`${API_BASE}/api/contacts`, {
    method: "GET",
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to load contacts");
  }

  return res.json();
}