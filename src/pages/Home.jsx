import { useEffect } from "react"

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
      <p>My name’s Jacob and I’m a game developer with a passion for experimenting, iterating, and finding the fun in complex systems. I come from a computer science background and have hands-on experience publishing a mobile game across all major app stores, but game development has made me a jack-of-all-trades. From programming in C# to designing UI, art, sound, and mechanics I’ve learned many talents on my journey so far. I love turning experiments into polished, finished experiences that players can enjoy. My goal is to collaborate with a creative team where I can contribute both technically and creatively, and help shape games that leave an impact.</p>
      <br></br>
      <p>Check out my completed game project Asteroid Emperor, a 2D roguelike action game currently in development for mobile.</p>
    </div>
  );
}

export default Home;