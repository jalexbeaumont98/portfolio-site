import { useEffect } from "react"

function About() {
  useEffect(() => {
    document.title = "About Me | Jacob Beaumont"
  }, [])

  return (
    <div>
      <h1>About Me</h1>
      
      <p>Hi! I’m Jacob Beaumont but you’re free to call me Jake.</p>
      <br></br>
      <img src="/profileshot.jpg" alt="Profile shot" className="aboutme-image" />
      <br></br>
      <p className="aboutme-description">
  Originally from Fredericton, New Brunswick, I’ve made my way to Halifax after graduating from UNB in the hopes of finding more opportunities in a bigger and busier city.
  <br /><br />
  I have a bachelor's degree in Computer Science and I've recently started the Game Programming Fast Track Program at Centennial College.
  <br /><br />
  I enjoy game development, going out with my friends, live music, and playing recreational as well as league sports—especially soccer, which I play on multiple teams.
  <br /><br />
  I have two cats and live with one roommate on the north end of Halifax.
</p>

      <br></br>
      <p>
      You can find my full resume{" "}
      <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
        here
      </a>{" "}
      for all my information.
    </p>
    </div>
  )
}

export default About