// client/src/api/projects.js
const API_BASE =
  import.meta.env.VITE_API_BASE || ""; // for localhost use ""

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Create a new project (admin only).
 * Minimal front-end fields → mapped to your Project schema.
 */
export async function createProject(token, payload) {
  const res = await fetch(`${API_BASE}/api/projects`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to create project");
  }

  return res.json();
}