// src/pages/Education.jsx
import { useEffect, useState } from "react";
import { listQualifications } from "../api/qualifications.js";

function formatMonthYear(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
  });
}

function Education() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Education | Jacob Beaumont";
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await listQualifications();
        if (!cancelled) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load education");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const now = new Date();

  return (
    <div>
      <h1>Education</h1>

      {loading && <p>Loading education…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p>No education entries yet.</p>
      )}

      {items.map((q) => {
        const startLabel = formatMonthYear(q.startDate);
        const endLabel = formatMonthYear(q.endDate);

        let dateLine = `${startLabel} – ${endLabel}`;
        const endDateObj = q.endDate ? new Date(q.endDate) : null;

        if (endDateObj && endDateObj > now) {
          dateLine += " (Expected)";
        }

        return (
          <section key={q._id} className="education-section">
            {/* institution + location */}
            <h2>
              {q.institution}
              {q.location ? `, ${q.location}` : ""}
            </h2>

            {/* title */}
            <h3>{q.title}</h3>

            {/* start date + end date (+ Expected if in future) */}
            <p>{dateLine}</p>

            {/* description */}
            <p>{q.description}</p>

            <hr />
          </section>
        );
      })}
    </div>
  );
}

export default Education;