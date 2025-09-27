import { useEffect } from "react"

function Services() {
  useEffect(() => {
    document.title = "Services | Jacob Beaumont"
  }, [])

  return (
    <div className="content">
      <h1>Services</h1>

      <img src="services.jpg" alt="service stock art" className="smaller-image" />

      <section className="service-section">
        <h2>Game Development</h2>
        <p>
          Full-cycle game development, from concept to finished product. 
          Experienced in programming, UI design, art, sound, and gameplay systems, 
          with a focus on creating fun and engaging player experiences.
        </p>
      </section>

      <section className="service-section">
        <h2>App Publication (iOS & Android)</h2>
        <p>
          End-to-end mobile app publication, including preparing builds, 
          navigating app store requirements, and deploying to both the Apple App Store 
          and Google Play Store. Hands-on experience successfully publishing a commercial game.
        </p>
      </section>
    </div>
  )
}

export default Services;