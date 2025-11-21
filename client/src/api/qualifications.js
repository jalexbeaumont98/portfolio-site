// src/api/qualifications.js
const API_BASE =
  import.meta.env.VITE_API_BASE || ""; // for localhost use ""

  function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

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

export async function listQualifications() {
  const res = await fetch(`${API_BASE}/api/qualifications`, {
    method: "GET",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to load education");
  }

  return res.json();
}

/**
 * Admin: update an existing qualification
 * PUT /api/qualifications/:id
 */
export async function updateQualification(token, id, payload) {
  const res = await fetch(`${API_BASE}/api/qualifications/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to update qualification");
  }

  return res.json();
}

/**
 * Admin: delete qualification
 * DELETE /api/qualifications/:id
 */
export async function deleteQualification(token, id) {
  const res = await fetch(`${API_BASE}/api/qualifications/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to delete qualification");
  }

  return res.json();
}