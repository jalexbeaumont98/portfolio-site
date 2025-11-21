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
 * Public: list all projects (for the public Projects page)
 * GET /api/projects
 */
export async function listProjects() {
  const res = await fetch(`${API_BASE}/api/projects`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to load projects");
  }
  return res.json();
}

/**
 * Admin: create a new project
 * POST /api/projects
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

/**
 * Admin: update an existing project
 * PUT /api/projects/:id
 */
export async function updateProject(token, id, payload) {
  const res = await fetch(`${API_BASE}/api/projects/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to update project");
  }

  return res.json();
}

/**
 * Admin: delete a project
 * DELETE /api/projects/:id
 */
export async function deleteProject(token, id) {
  const res = await fetch(`${API_BASE}/api/projects/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to delete project");
  }

  return res.json();
}
