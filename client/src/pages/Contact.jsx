import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Contact() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    message: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // In a real app you'd send data to backend/email service
    navigate("/") // ✅ redirects back to Home Page
  }

  return (
    <div className="content">
      <h1>Contact Me</h1>

      {/* Contact info panel */}
      <section className="contact-info">
        <span><strong>Email:</strong> contact@jalexbeaumont.com</span>
        <span><strong>Phone:</strong> (506) 470-7704</span>
        <span><strong>Location:</strong> Halifax, NS</span>
      </section>

      {/* Contact form */}
      <form className="contact-form" onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Contact Number:</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Email Address:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Message:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit">Send Message</button>
      </form>
    </div>
  )
}

export default Contact