// src/pages/NewProject.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projects.js";

function toInputDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

// Helper: get first link URL of a given type from links[]
function getLink(project, type) {
  const link = (project.links || []).find((l) => l.type === type);
  return link?.url || "";
}

export default function NewProject() {
  const { auth } = useAuth();
  const token = auth?.token;
  const user = auth?.user;
  const isAdmin = user?.role === "admin";

  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(""); // "" = new project
  const [loadingList, setLoadingList] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [completionDate, setCompletionDate] = useState("");

  const [githubUrl, setGithubUrl] = useState("");
  const [itchUrl, setItchUrl] = useState("");
  const [appstoreUrl, setAppstoreUrl] = useState("");
  const [playstoreUrl, setPlaystoreUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [imageUrlsCsv, setImageUrlsCsv] = useState("");
  const [techStackCsv, setTechStackCsv] = useState("");
  const [role, setRole] = useState("");
  const [featured, setFeatured] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const currentProject = useMemo(
    () => projects.find((p) => p._id === selectedId) || null,
    [projects, selectedId]
  );

  const isEditMode = !!currentProject;

  // Load all projects
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoadingList(true);
        setError("");
        const data = await listProjects();
        if (!cancelled) {
          setProjects(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load projects");
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Populate / clear form when selection changes
  useEffect(() => {
    setError("");
    setInfo("");

    if (!currentProject) {
      // New project mode
      setTitle("");
      setTagline("");
      setDescription("");
      setCompleted(false);
      setCompletionDate("");
      setGithubUrl("");
      setItchUrl("");
      setVideoUrl("");
      setAppstoreUrl("");
      setPlaystoreUrl("");
      setImageUrlsCsv("");
      setTechStackCsv("");
      setRole("");
      setFeatured(false);
      return;
    }

    // Edit existing
    setTitle(currentProject.title || "");
    setTagline(currentProject.tagline || "");
    setDescription(currentProject.description || "");
    setCompleted(!!currentProject.completed);
    setCompletionDate(toInputDate(currentProject.completionDate));

    setGithubUrl(getLink(currentProject, "github"));
    setItchUrl(getLink(currentProject, "itch"));
    setAppstoreUrl(getLink(currentProject, "appstore"));
    setPlaystoreUrl(getLink(currentProject, "playstore"));

    setVideoUrl(currentProject.videoUrl || "");

    setImageUrlsCsv((currentProject.imageUrls || []).join(", "));
    setTechStackCsv((currentProject.techStack || []).join(", "));

    setRole(currentProject.role || "");
    setFeatured(!!currentProject.featured);
  }, [currentProject]);

  // Build payload from form state
  function buildPayload() {
    const links = [];

    if (githubUrl.trim()) {
      links.push({ label: "GitHub", url: githubUrl.trim(), type: "github" });
    }
    if (itchUrl.trim()) {
      links.push({ label: "itch.io", url: itchUrl.trim(), type: "itch" });
    }
    if (appstoreUrl.trim()) {
      links.push({
        label: "App Store",
        url: appstoreUrl.trim(),
        type: "appstore",
      });
    }

    if (playstoreUrl.trim()) {
      links.push({
        label: "Play Store",
        url: playstoreUrl.trim(),
        type: "playstore",
      });
    }

    const imageUrls =
      imageUrlsCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const techStack =
      techStackCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    return {
      title,
      tagline,
      description,
      completed,
      completionDate: completed && completionDate ? completionDate : null,
      links,
      videoUrl: videoUrl || undefined,
      imageUrls,
      techStack,
      role,
      featured,
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !isAdmin) {
      setError("You must be an admin to modify projects.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setInfo("");

      const payload = buildPayload();

      if (isEditMode) {
        await updateProject(token, currentProject._id, payload);
        setInfo("Project updated.");
      } else {
        await createProject(token, payload);
        setInfo("Project created.");
      }

      // Reload list after changes
      const refreshed = await listProjects();
      setProjects(Array.isArray(refreshed) ? refreshed : []);

      if (!isEditMode) {
        // Stay in "new" mode after create
        setSelectedId("");
        setTitle("");
        setTagline("");
        setDescription("");
        setCompleted(false);
        setCompletionDate("");
        setGithubUrl("");
        setItchUrl("");
        setAppstoreUrl("");
        setPlaystoreUrl("");
        setVideoUrl("");
        setImageUrlsCsv("");
        setTechStackCsv("");
        setRole("");
        setFeatured(false);
      }
    } catch (err) {
      setError(err.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !isAdmin || !currentProject) return;
    const ok = window.confirm("Are you sure you want to delete this project?");
    if (!ok) return;

    try {
      setSaving(true);
      setError("");
      setInfo("");

      await deleteProject(token, currentProject._id);
      setInfo("Project deleted.");

      const refreshed = await listProjects();
      setProjects(Array.isArray(refreshed) ? refreshed : []);
      setSelectedId("");
    } catch (err) {
      setError(err.message || "Failed to delete project");
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="page-container">
        <h1>Projects Admin</h1>
        <p>You must be an admin to manage projects.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Manage Projects</h1>
      <p>
        Use this page to create new portfolio projects or edit/delete existing ones.
      </p>

      {/* Dropdown selector */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Select project:&nbsp;
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={loadingList}
          >
            <option value="">➕ New project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title} {p.tagline ? `— ${p.tagline}` : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Tagline
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </label>

        <label>
          Description
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          Completed?
        </label>

        {completed && (
          <label>
            Completion Date
            <input
              type="date"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
            />
          </label>
        )}

        <h3>Links</h3>
        <label>
          GitHub URL
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/..."
          />
        </label>

        <label>
          itch.io URL
          <input
            type="url"
            value={itchUrl}
            onChange={(e) => setItchUrl(e.target.value)}
            placeholder="https://jalexbeaumont.itch.io/..."
          />
        </label>

        <label>
          App Store URL
          <input
            type="url"
            value={appstoreUrl}
            onChange={(e) => setAppstoreUrl(e.target.value)}
            placeholder="https://apps.apple.com/…"
          />
        </label>

        <label>
          Play Store URL
          <input
            type="url"
            value={playstoreUrl}
            onChange={(e) => setPlaystoreUrl(e.target.value)}
            placeholder="https://play.google.com/store/apps/…"
          />
        </label>

        <label>
          Video URL (YouTube / itch.io embed page, etc.)
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </label>

        <label>
          Image URLs (comma separated)
          <input
            type="text"
            value={imageUrlsCsv}
            onChange={(e) => setImageUrlsCsv(e.target.value)}
            placeholder="https://... , https://..."
          />
        </label>

        <label>
          Tech Stack (comma separated)
          <input
            type="text"
            value={techStackCsv}
            onChange={(e) => setTechStackCsv(e.target.value)}
            placeholder="Unity, C#, Firebase"
          />
        </label>

        <label>
          Role
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Solo dev, Programmer, etc."
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Featured?
        </label>

        {error && <p className="form-error">{error}</p>}
        {info && <p className="form-info">{info}</p>}

        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <button type="submit" disabled={saving}>
            {saving
              ? isEditMode
                ? "Saving…"
                : "Creating…"
              : isEditMode
                ? "Update Project"
                : "Create Project"}
          </button>

          {isEditMode && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              style={{ backgroundColor: "#c0392b", color: "#fff" }}
            >
              Delete Project
            </button>
          )}
        </div>
      </form>
    </div>
  );
}