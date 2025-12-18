// src/pages/Projects.jsx
import { useEffect, useMemo, useState } from "react";
import { listProjects } from "../api/projects";
import "./Projects.css";
import LoadingImage from "../components/LoadingImage";

const LINK_TYPE_ORDER = {
  playable: 0,   // NEW: show "Try this project!" first
  github: 1,
  appstore: 2,
  playstore: 3,
  itch: 4,
  docs: 5,
  video: 6,
  other: 99,
};

function sortLinks(links = []) {
  return [...links].sort((a, b) => {
    const aOrder = LINK_TYPE_ORDER[a.type] ?? LINK_TYPE_ORDER.other;
    const bOrder = LINK_TYPE_ORDER[b.type] ?? LINK_TYPE_ORDER.other;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return (a.label || "").localeCompare(b.label || "");
  });
}

function formatDate(date) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return "";
  }
}

function projectStatusLabel(p) {
  if (p?.completed) {
    return "Completed";
  }
  return "In Progress";
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [openIds, setOpenIds] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Projects | Jacob Beaumont";

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await listProjects();
        const list = Array.isArray(data) ? data : [];

        if (!cancelled) {
          setProjects(list);

          // Open all featured projects by default (first load)
          const featuredIds = new Set(
            list.filter((p) => p?.featured && p?._id).map((p) => p._id)
          );
          setOpenIds(featuredIds);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || "Failed to load projects");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      // 1) Featured first
      const aFeatured = a?.featured ? 1 : 0;
      const bFeatured = b?.featured ? 1 : 0;
      if (aFeatured !== bFeatured) return bFeatured - aFeatured;

      // 2) Higher priority first (default 0)
      const aPriority = Number.isFinite(a?.priority) ? a.priority : 0;
      const bPriority = Number.isFinite(b?.priority) ? b.priority : 0;
      if (aPriority !== bPriority) return bPriority - aPriority;

      // 3) Newest updated/created last tie-breaker
      const aTime = new Date(a?.updated || a?.created || 0).getTime();
      const bTime = new Date(b?.updated || b?.created || 0).getTime();
      return bTime - aTime;
    });
  }, [projects]);

  function toggleOpen(id) {
    if (!id) return;
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="content">
      <h1>Projects</h1>
      <hr className="projects-title-rule" />

      {loading && <p>Loading projects…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && sortedProjects.length === 0 && (
        <p>No projects found. (Log in as admin to add some!)</p>
      )}

      {!loading && !error && sortedProjects.length > 0 && (
        <div className="projects-list">
          {sortedProjects.map((p) => {
            const id = p?._id;
            const isOpen = id ? openIds.has(id) : false;

            const iconUrl =
              p?.iconUrl ||
              (Array.isArray(p?.imageUrls) && p.imageUrls.length > 0 ? p.imageUrls[0] : "");

            const links = sortLinks(p?.links || []);
            const playableLink = (p?.links || []).find((lnk) => lnk?.type === "playable");
            const otherLinks = links.filter((lnk) => lnk?.type !== "playable");
            const status = projectStatusLabel(p);

            // Chips for the collapsed row (you can change this easily later)
            const chips = [];
            if (p?.role) chips.push(p.role);
            if (Array.isArray(p?.techStack) && p.techStack.length > 0) {
              chips.push(p.techStack.slice(0, 3).join(" · "));
            }
            chips.push(status);

            const bodyId = id ? `project-body-${id}` : undefined;

            return (
              <article
                key={id || p.title}
                className={[
                  "project-module",
                  isOpen ? "is-open" : "",
                  p?.featured ? "is-featured" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {/* Collapsed Row / Header */}
                <button
                  type="button"
                  className="project-header"
                  onClick={() => toggleOpen(id)}
                  aria-expanded={isOpen}
                  aria-controls={bodyId}
                >
                  {iconUrl ? (
                    <img
                      className="project-icon"
                      src={iconUrl}
                      alt={`${p?.title || "Project"} icon`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="project-icon" aria-hidden="true" />
                  )}

                  <div className="project-header-main">
                    <h2 className="project-title">{p?.title}</h2>
                    {p?.tagline && (
                      <p className="project-subtitle">{p.tagline}</p>
                    )}
                  </div>

                  <div className="project-header-right">
                    <div className="project-chips" aria-hidden="true">
                      {playableLink?.url && (
                        <a
                          className="project-chip project-chip--playable"
                          href={playableLink.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()} // don't toggle accordion
                        >
                          {playableLink.label || "Try it"}
                        </a>
                      )}

                      {chips.slice(0, 3).map((c, idx) => (
                        <span key={idx} className="project-chip">
                          {c}
                        </span>
                      ))}
                    </div>

                    <span className="project-toggle" aria-hidden="true">
                      ▼
                    </span>
                  </div>
                </button>

                {/* Expanded Content */}
                {isOpen && (
                  <div id={bodyId} className="project-body">

                    {/* Images (in order) */}
                    {Array.isArray(p?.imageUrls) && p.imageUrls.length > 0 && (
                      <div className="project-images">
                        {p.imageUrls.map((url, idx) => (
                          <LoadingImage
                            key={idx}
                            src={url}
                            alt={`${p.title} screenshot ${idx + 1}`}
                            className="project-image"
                          />
                        ))}
                      </div>
                    )}





                    {/* Description */}
                    {p?.description && (
                      <p className="project-description">{p.description}</p>
                    )}               

                    {/* Itch.io embed (schema: itchWidgetEmbed) */}
                    {p?.itchWidgetEmbed && (
                      <div
                        className="project-itch-embed"
                        // ⚠️ Assumes only you (admin) can set this field.
                        dangerouslySetInnerHTML={{ __html: p.itchWidgetEmbed }}
                      />
                    )}

                    {/* Links */}
                    {otherLinks.length > 0 && (
                      <div className="project-links">
                        <h3>Relevant Links</h3>
                        <ul>
                          {otherLinks.map((lnk, i) => (
                            <li key={i}>
                              <a
                                href={lnk.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {lnk.label || lnk.type || "Link"}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Embedded video */}
                    {p?.videoUrl && (
                      <iframe
                        className="project-video"
                        src={p.videoUrl}
                        title={`${p.title} video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}

                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}