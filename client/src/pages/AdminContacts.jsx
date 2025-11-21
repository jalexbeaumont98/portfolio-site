// src/pages/AdminContacts.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { listContacts, deleteContact } from "../api/contacts.js";
import "./AdminContacts.css";

export default function AdminContacts() {
  const { auth } = useAuth();
  const token = auth?.token;

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await listContacts(token);
        if (!cancelled) {
          setContacts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load contacts");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [token]);

  const handleDelete = async (id) => {
    if (!token) return;

    const ok = window.confirm("Are you sure you want to delete this message?");
    if (!ok) return;

    try {
      setError("");
      await deleteContact(token, id);
      // Optimistically remove from local state
      setContacts(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete contact");
    }
  };

  return (
    <div className="page-container admin-contacts-page">
      <h1>Contact Messages</h1>
      <p className="admin-contacts-subtitle">
        Admin-only view of all contact form submissions stored in MongoDB.
      </p>

      {loading && <p>Loading contacts…</p>}
      {error && <p className="admin-contacts-error">{error}</p>}

      {!loading && !error && contacts.length === 0 && (
        <p>No contact messages yet.</p>
      )}

      <div className="contacts-grid">
        {contacts.map((c) => (
          <article key={c._id} className="contact-card">
            <header className="contact-card-header">
              <h2>
                {c.firstname} {c.lastname}
              </h2>
              <span className="contact-email">{c.email}</span>
            </header>

            <p className="contact-message">
              {c.message}
            </p>

            <footer className="contact-card-footer">
              <span>
                Received:{" "}
                {c.createdAt
                  ? new Date(c.createdAt).toLocaleString()
                  : "Unknown"}
              </span>

              <button
                type="button"
                className="contact-delete-button"
                onClick={() => handleDelete(c._id)}
              >
                Delete
              </button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}