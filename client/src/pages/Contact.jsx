// src/pages/Contact.jsx
import { useState } from "react";
import { createContact } from "../api/contacts.js";

export default function Contact() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname]   = useState("");
  const [email, setEmail]         = useState("");
  const [message, setMessage]     = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [info, setInfo]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    // super basic client-side check
    if (!firstname || !lastname || !email || !message) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);
      await createContact({ firstname, lastname, email, message });

      setInfo("Thanks for reaching out! I’ll get back to you soon.");
      setFirstname("");
      setLastname("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Contact Me</h1>
      <p>
        Have a question, want to collaborate, or just say hi?
        Drop a message below and I'll get back to you!
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            type="text"
            value={firstname}
            onChange={e => setFirstname(e.target.value)}
            required
          />
        </label>

        <label>
          Last Name
          <input
            type="text"
            value={lastname}
            onChange={e => setLastname(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Message
          <textarea
            rows={5}
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}
        {info && <p className="form-info">{info}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Sending…" : "Send Message"}
        </button>
      </form>
    </div>
  );
}