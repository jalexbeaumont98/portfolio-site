import { useEffect } from "react"

function Education() {
  useEffect(() => {
    document.title = "Education | Jacob Beaumont"
  }, [])

  return (
    <div>
      <h1>Education</h1>

      <section className="education-section">
        <h2>Centennial College, Scarborough</h2>
        <h3>Game Programming Fast Track</h3>
        <p>September 2025 – May 2027 (Expected)</p>
        <p>
          Enrolled in an intensive program focused on advanced game programming concepts, 
          with hands-on co-op experience to strengthen industry knowledge and skills.
        </p>
      </section>

      <hr />

      <section className="education-section">
        <h2>University of New Brunswick, Fredericton</h2>
        <h3>Bachelor of Computer Science with Co-op Designation</h3>
        <p>September 2017 – October 2023</p>
        <p>
          Completed a comprehensive computer science degree with a focus on software development 
          and co-op placements that provided real-world industry experience.
        </p>
      </section>
    </div>
  )
}

export default Education;