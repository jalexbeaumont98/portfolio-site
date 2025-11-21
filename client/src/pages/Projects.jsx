// src/pages/Projects.jsx
import { useEffect, useState, useMemo } from "react";
import { listProjects } from "../api/projects";

const LINK_TYPE_ORDER = {
  github: 1,
  appstore: 2,
  playstore: 3,
  itch: 4,
  store: 5,
  docs: 6,
  video: 7,
  other: 99,
};

function sortLinks(links = []) {
  return [...links].sort((a, b) => {
    const aOrder = LINK_TYPE_ORDER[a.type] ?? LINK_TYPE_ORDER.other;
    const bOrder = LINK_TYPE_ORDER[b.type] ?? LINK_TYPE_ORDER.other;
    if (aOrder !== bOrder) return aOrder - bOrder;
    // tie-breaker: label alphabetically
    return (a.label || "").localeCompare(b.label || "");
  });
}

function formatDateRange(startDate, endDate) {
  if (!startDate && !endDate) return null;
  const start = startDate ? new Date(startDate).toLocaleDateString() : "";
  const end = endDate ? new Date(endDate).toLocaleDateString() : "";
  if (start && end) return `${start} – ${end}`;
  return start || end;
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    document.title = "Projects | Jacob Beaumont";

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await listProjects();
        if (!cancelled) {
          setProjects(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load projects");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const sortedProjects = useMemo(() => {
    // Optional: featured first, then newest
    return [...projects].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (b.featured && !a.featured) return 1;
      const aDate = a.created ? new Date(a.created).getTime() : 0;
      const bDate = b.created ? new Date(b.created).getTime() : 0;
      return bDate - aDate;
    });
  }, [projects]);

  return (
    <div className="content">
      <h1>Projects</h1>

      {loading && <p>Loading projects…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && sortedProjects.length === 0 && (
        <p>No projects found. (Log in as admin to add some!)</p>
      )}

      {sortedProjects.map((p) => {
        const links = sortLinks(p.links || []);
        const dateRange = formatDateRange(p.startDate, p.endDate);

        return (
          <section key={p._id} className="project-section">
            {/* Title */}
            <h2>{p.title}</h2>

            {/* Tagline */}
            {p.tagline && (
              <p className="project-tagline">
                {p.tagline}
              </p>
            )}

            {/* Images (in order) */}
            {Array.isArray(p.imageUrls) && p.imageUrls.length > 0 && (
              <div className="project-images">
                {p.imageUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`${p.title} screenshot ${idx + 1}`}
                    className="project-image"
                  />
                ))}
              </div>
            )}

            {/* Meta info (optional) */}
            {(p.role || p.techStack?.length || dateRange) && (
              <p className="project-meta">
                {p.role && <>Role: {p.role}<br /></>}
                {dateRange && <>Timeline: {dateRange}<br /></>}
                {p.techStack && p.techStack.length > 0 && (
                  <>Tech: {p.techStack.join(", ")}<br /></>
                )}
                {typeof p.completed === "boolean" && (
                  <>
                    Status:{" "}
                    {p.completed
                      ? p.completionDate
                        ? `Completed (${new Date(p.completionDate).toLocaleDateString()})`
                        : "Completed"
                      : "In Progress"}
                  </>
                )}
              </p>
            )}

            {/* Description */}
            {p.description && (
              <p className="project-description">
                {p.description}
              </p>
            )}

            {/* Embedded video (YouTube, etc.) */}
            {p.videoUrl && (
              <iframe
                className="project-video"
                src={p.videoUrl}
                title={`${p.title} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            {/* Itch.io embed (raw iframe string, optional) */}
            {p.itchEmbedHtml && (
              <div
                className="project-itch-embed"
                // ⚠️ We assume only you (admin) can set this field.
                dangerouslySetInnerHTML={{ __html: p.itchEmbedHtml }}
              />
            )}

            {/* Links, in priority order */}
            {links.length > 0 && (
              <div className="project-links">
                <h3>Relevant Links</h3>
                <ul>
                  {links.map((lnk, i) => (
                    <li key={i}>
                      <a href={lnk.url} target="_blank" rel="noreferrer">
                        {lnk.label || lnk.type || "Link"}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <hr />
          </section>
        );
      })}
    </div>
  );
}