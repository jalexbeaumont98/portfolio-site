import { useEffect } from "react"
import { Link } from "react-router-dom"


function Home() {
  useEffect(() => {
    document.title = "Home | Jacob Beaumont"
  }, [])

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to my personal webpage!
      </p>
      <br>
      </br>
      <p>My name’s Jacob and I’m a game developer with a passion for experimenting, iterating, and finding the fun in complex systems. I come from a computer science background and have hands-on experience publishing a mobile game across all major app stores, but game development has made me a jack-of-all-trades. From programming in C# to designing UI, art, sound, and mechanics I’ve learned many talents on my journey so far. I love turning experiments into polished, finished experiences that players can enjoy.</p>
      <br></br>
      <p>My goal is to collaborate with a creative team where I can contribute both technically and creatively, and help shape games that leave an impact.</p>
      <br></br>
      <p>
        Check out my game
        <Link to="/projects"> Asteroid Emperor</Link>,
        a 2D roguelike action game released on mobile platforms.
      </p>
      <br>
      </br>
      <div>
        <h3>Other places to find me:</h3>
        <ul>
          <li><a href="https://github.com/jalexbeaumont98" target="_blank">Github</a></li>
          <li><a href="https://www.linkedin.com/in/jacob-beaumont-aa743717a/" target="_blank">LinkedIn</a></li>
          <li><a href="https://jalexbeaumont.itch.io/" target="_blank">itch.io</a></li>
          <li><a href="https://x.com/JacobBeaumont18" target="_blank">Twitter</a></li>
        </ul>
      </div>
    </div>
  );
}

export default Home;