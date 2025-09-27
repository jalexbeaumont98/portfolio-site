import { useEffect } from "react"

function Projects() {
    useEffect(() => {
        document.title = "Projects | Jacob Beaumont"
    }, [])

    return (
        <div className="content">
            <h1>Projects</h1>

            {/* Project 1 */}
            <section className="project-section">
                <h2>Asteroid Emperor</h2>
                <br></br>
                <img src="/ae_projectphoto2.png" alt="Project One Screenshot" className="project-image" />

                <p>Dodge, shoot, and harness the chaos of bouncing, pinball-like asteroids!<br></br>

                    Rise up and fight through 9 unique worlds to take your rightful place as the strongest in this asteroid filled rogue-like shooter.</p>

                <br></br>
                <iframe
                    className="project-video"
                    src="https://www.youtube.com/embed/RGUJuzWLBgk"
                    title="Project One Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>

                <p>
                    A large 2D video game in the Construct3 game engine for mobile devices called Asteroid Emperor.
                    I was solely responsible for all game design, art, programming, and testing for the project.
                    Gained valuable skills in managing a large project over a long time period as the game grew in size and complexity.
                    Learned the ins and outs of deploying an application to mobile devices as well as developing a game for cross-platform.
                    Released the game to the Play Store, App Store, and itch.io.
                    Earned over 500 downloads between the stores, a positive rating on AppRaven, and received a positive review by SNAPP.
                    <br></br>
                    <br></br> Role: Developer and Owner
                    <br></br> Outcome: Finished and published to stores.

                </p>

                <div>
                    <h3>Relevant Links</h3>
                    <ul>
                        <li><a href="https://play.google.com/store/apps/details?id=com.niftygames.asteroidemperor" target="_blank">Google Play</a></li>
                        <li><a href="https://apps.apple.com/us/app/asteroid-emperor/id6502265638" target="_blank">App Store</a></li>
                    </ul>
                </div>

                <iframe frameborder="0" src="https://itch.io/embed/2597319" width="552" height="167"><a href="https://jalexbeaumont.itch.io/asteroid-emperor">Asteroid Emperor by jalex</a></iframe>
            </section>

            <hr />

            {/* Project 2 */}
            <section className="project-section">
                <h2>Untitled Tower Defense Game</h2>
                <img src="towerdefence1.png" alt="Project Two Screenshot" className="project-image" />

                <p>A simple tower defense game in Unity C# to show proficiency in the engine/language as well as programming patterns and UI.</p>

                {/* will add this another day
                <video width="400" controls>
                    <source src="path-to-project2-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                */}
                <img src="towerdefence2.png" alt="Project Two Screenshot" className="project-image" />
                <p>
                    Built in unity, this project has been a long term attempt to demonstrate my skills as a developer and was solely made by myself. The projects main inspiration was the book Game Programming Patterns by Robert Nystrom and it features many of the patterns described in the book. Some features include: dedicated UI, asset loading, events, turret upgrades, and enemies that can be modified using data files.
                    <br></br>
                    <br></br> Role: Developer and Owner
                    <br></br> Outcome: In progress.
                </p>


                <div>
                    <h3>Relevant Links</h3>
                    <ul>
                        <li><a href="https://github.com/jalexbeaumont98/towerdefencegame" target="_blank">GitHub Repo</a></li>
                    </ul>
                </div>
            </section>

            <hr />

            {/* Project 3 */}
            <section className="project-section">
                <h2>Custom Archaeology Drawing Tool</h2>
                <img src="archeosoft.png" alt="Drawing Tool Screenshot" className="project-image" />

                <p>A Unity-based drawing tool built for archaeologists to create precise dig site diagrams.</p>

                {/* todo */}
                {/* 
  <video width="400" controls>
    <source src="path-to-project3-video.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  */}

                <p>
                    Developed a specialized tool within Unity that streamlined diagram creation for archaeologists.
                    Features included image integration, customizable templates, color selection, and cropping capabilities.
                    The tool was also integrated with the application's data entry system, making it easy to insert
                    finished diagrams directly into archaeological records. Was solely developed by myself based on direction from my supervisors and was part of a larger software.
                    <br></br>
                    <br></br> Role: Developer 
                    <br></br> Outcome: Finished during time at company.

                </p>

                <div>
                    <h3>Relevant Links</h3>
                    <ul>
                        <li><a href="https://www.archaeosoft.com/" target="_blank">Software's Website</a></li>
                    </ul>
                </div>


            </section>
        </div>
    )
}

export default Projects;