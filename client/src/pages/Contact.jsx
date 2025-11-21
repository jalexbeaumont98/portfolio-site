// src/pages/Contact.jsx
import { useState } from "react";
import { createContact } from "../api/contacts";

export default function Contact() {
  // Form fields
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname]   = useState("");
  const [email, setEmail]         = useState("");
  const [message, setMessage]     = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [status, setStatus]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setStatus("");
      setLoading(true);

      // Call backend – this assumes createContact(payload) signature
      await createContact({
        firstname,
        lastname,
        email,
        message,
      });

      setStatus("Message sent! Thanks for reaching out.");
      // Clear form
      setFirstname("");
      setLastname("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Contact Me</h1>
      <p>
        Have a question, want to collaborate, or just say hi?
        Drop a message below and I&apos;ll get back to you!
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </label>

        <label>
          Last Name
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Message
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}
        {status && <p className="form-info">{status}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Sending…" : "Send Message"}
        </button>
      </form>
    </div>
  );
}