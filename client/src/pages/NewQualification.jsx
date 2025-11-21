// src/pages/NewQualification.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { createQualification } from "../api/qualifications.js";

export default function NewQualification() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const token = auth?.token;

  const [title, setTitle] = useState("");
  const [institution, setInstitution] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(""); // use yyyy-mm-dd strings
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError]       = useState("");
  const [info, setInfo]         = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("You must be logged in as an admin.");
      return;
    }

    setLoading(true);
    setError("");
    setInfo("");

    try {
      const payload = {
        title,
        institution,
        location,
        startDate, // backend will parse as Date
        endDate,
        description,
      };

      await createQualification(token, payload);
      setInfo("Qualification created successfully!");

      // optional: redirect to education page after a short delay
      setTimeout(() => navigate("/education"), 800);
    } catch (err) {
      setError(err.message || "Failed to create qualification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Add Qualification</h1>

      <form className="new-project-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Institution
          <input
            type="text"
            value={institution}
            onChange={e => setInstitution(e.target.value)}
            required
          />
        </label>

        <label>
          Location
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
          />
        </label>

        <label>
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />
        </label>

        <label>
          End Date
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}
        {info && <p className="form-info">{info}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Create Qualification"}
        </button>
      </form>
    </div>
  );
}