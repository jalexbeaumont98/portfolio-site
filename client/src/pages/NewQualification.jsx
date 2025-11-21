// src/pages/NewQualification.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import {
  listQualifications,
  createQualification,
  updateQualification,
  deleteQualification,
} from "../api/qualifications.js";

function toInputDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10); // yyyy-MM-dd
}

export default function NewQualification() {
  const { auth } = useAuth();
  const token = auth?.token;
  const user  = auth?.user;

  const [qualifications, setQualifications] = useState([]);
  const [selectedId, setSelectedId]         = useState(""); // "" = new
  const [loadingList, setLoadingList]       = useState(true);

  const [title, setTitle]             = useState("");
  const [institution, setInstitution] = useState("");
  const [location, setLocation]       = useState("");
  const [startDate, setStartDate]     = useState("");
  const [endDate, setEndDate]         = useState("");
  const [description, setDescription] = useState("");

  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [info, setInfo]       = useState("");

  // Just a little safety: only allow if admin
  const isAdmin = user?.role === "admin";

  const currentQualification = useMemo(
    () => qualifications.find((q) => q._id === selectedId) || null,
    [qualifications, selectedId]
  );

  const isEditMode = !!currentQualification;

  // Load all qualifications
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoadingList(true);
        setError("");
        const data = await listQualifications();
        if (!cancelled) {
          setQualifications(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load qualifications");
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // When selectedId changes, update form
  useEffect(() => {
    setError("");
    setInfo("");

    if (!currentQualification) {
      // New mode → clear form
      setTitle("");
      setInstitution("");
      setLocation("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      return;
    }

    // Edit mode → populate form
    setTitle(currentQualification.title || "");
    setInstitution(currentQualification.institution || "");
    setLocation(currentQualification.location || "");
    setStartDate(toInputDate(currentQualification.startDate));
    setEndDate(toInputDate(currentQualification.endDate));
    setDescription(currentQualification.description || "");
  }, [currentQualification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !isAdmin) {
      setError("You must be an admin to modify qualifications.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setInfo("");

      const payload = {
        title,
        institution,
        location,
        startDate,
        endDate,
        description,
      };

      if (isEditMode) {
        await updateQualification(token, currentQualification._id, payload);
        setInfo("Qualification updated.");
      } else {
        await createQualification(token, payload);
        setInfo("Qualification created.");
      }

      // Reload list so dropdown reflects changes
      const refreshed = await listQualifications();
      setQualifications(Array.isArray(refreshed) ? refreshed : []);

      if (!isEditMode) {
        // After creating, optionally clear or select the new one
        setTitle("");
        setInstitution("");
        setLocation("");
        setStartDate("");
        setEndDate("");
        setDescription("");
        setSelectedId(""); // stay on "new"
      }

    } catch (err) {
      setError(err.message || "Failed to save qualification");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !isAdmin || !currentQualification) return;
    const ok = window.confirm("Are you sure you want to delete this qualification?");
    if (!ok) return;

    try {
      setSaving(true);
      setError("");
      setInfo("");

      await deleteQualification(token, currentQualification._id);
      setInfo("Qualification deleted.");

      // reload list
      const refreshed = await listQualifications();
      setQualifications(Array.isArray(refreshed) ? refreshed : []);
      setSelectedId(""); // go back to "new"
    } catch (err) {
      setError(err.message || "Failed to delete qualification");
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="page-container">
        <h1>Qualifications Admin</h1>
        <p>You must be an admin to manage qualifications.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Manage Qualifications</h1>
      <p>
        Create new qualifications or select an existing one from the dropdown to update or delete it.
      </p>

      {/* Dropdown selector */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Select qualification:&nbsp;
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={loadingList}
          >
            <option value="">➕ New qualification</option>
            {qualifications.map((q) => (
              <option key={q._id} value={q._id}>
                {q.title} — {q.institution}
              </option>
            ))}
          </select>
        </label>
      </div>

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
          Institution
          <input
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            required
          />
        </label>

        <label>
          Location
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>

        <label>
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>

        <label>
          End Date
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
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

        {error && <p className="form-error">{error}</p>}
        {info && <p className="form-info">{info}</p>}

        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <button type="submit" disabled={saving}>
            {saving
              ? isEditMode
                ? "Saving…"
                : "Creating…"
              : isEditMode
              ? "Update Qualification"
              : "Create Qualification"}
          </button>

          {isEditMode && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              style={{ backgroundColor: "#c0392b", color: "#fff" }}
            >
              Delete Qualification
            </button>
          )}
        </div>
      </form>
    </div>
  );
}