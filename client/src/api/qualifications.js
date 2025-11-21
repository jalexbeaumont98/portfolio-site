// src/api/qualifications.js
const API_BASE =
  import.meta.env.VITE_API_BASE || ""; // for localhost use ""

/**
 * Create a new qualification (ADMIN ONLY).
 *
 * Example payload:
 * {
 *   title: "BSc Computer Science",
 *   institution: "University of New Brunswick",
 *   location: "Fredericton, NB",
 *   startDate: "2017-09-01",
 *   endDate: "2022-05-15",
 *   description: "Co-op program focused on game dev..."
 * }
 */
export async function createQualification(token, payload) {
  const res = await fetch(`${API_BASE}/api/qualifications`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to create qualification");
  }

  return res.json();
}