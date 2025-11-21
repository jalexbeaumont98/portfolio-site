// client/src/pages/NewProject.jsx
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { createProject } from "../api/projects";

export default function NewProject() {
  const { auth } = useAuth();
  const token = auth?.token;

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [completionDate, setCompletionDate] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [itchUrl, setItchUrl] = useState("");
  const [appstoreUrl, setAppStoreUrl] = useState("");
  const [playstoreUrl, setPlayStoreUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrls, setImageUrls] = useState(""); // comma-separated
  const [techStack, setTechStack] = useState(""); // comma-separated
  const [featured, setFeatured] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("You must be logged in as admin.");
      return;
    }

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      // Build links array based on filled fields
      const links = [];
      if (githubUrl) {
        links.push({ label: "GitHub", url: githubUrl, type: "github" });
      }
      if (itchUrl) {
        links.push({ label: "itch.io", url: itchUrl, type: "itch" });
      }
      if (appstoreUrl) {
        links.push({ label: "App Store", url: appstoreUrl, type: "appstore" });
      }
      if (playstoreUrl) {
        links.push({ label: "Play Store", url: playstoreUrl, type: "playstore" });
      }

      const payload = {
        title,
        tagline,
        description,
        completed,
        completionDate: completed && completionDate ? completionDate : null,
        links,
        videoUrl: videoUrl || null,
        imageUrls: imageUrls
          ? imageUrls.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        techStack: techStack
          ? techStack.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        featured,
      };

      const created = await createProject(token, payload);
      setSuccess(`Project "${created.title}" created successfully.`);
      // optionally clear form:
      // setTitle(""); setTagline(""); ...
    } catch (err) {
      setError(err.message || "Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1 className="form-title">Add New Project</h1>
        <form className="new-project-form" onSubmit={handleSubmit}>
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
              placeholder="Short one-line summary"
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            <span>Project completed</span>
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
              onChange={(e) => setAppStoreUrl(e.target.value)}
              placeholder="https://apps.apple.com/us/app/..."
            />
          </label>
          <label>
            Play Store URL
            <input
              type="url"
              value={playstoreUrl}
              onChange={(e) => setPlayStoreUrl(e.target.value)}
              placeholder="https://play.google.com/store/apps/details?id=..."
            />
          </label>

          <label>
            Video URL (embed source)
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="YouTube / itch embed URL"
            />
          </label>

          <label>
            Image URLs (comma-separated)
            <input
              type="text"
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              placeholder="https://... , https://..."
            />
          </label>

          <label>
            Tech Stack (comma-separated)
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="Unity, C#, Firebase"
            />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <span>Feature this project on the homepage</span>
          </label>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}