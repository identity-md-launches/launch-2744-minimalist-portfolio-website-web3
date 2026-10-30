import { useState } from 'react'
import { projects, skills } from './content'
import type { Project } from './content'
import { Arrow, Mark, XIcon } from './components/Icons'
import ProjectDialog from './components/ProjectDialog'
import ContactForm from './components/ContactForm'

export default function App() {
  const [project, setProject] = useState<Project | null>(null)

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header shell">
        <a className="brand" href="#" aria-label="Kaito, home">
          <Mark />
          <span>
            kaito<span className="brand-dot">.</span>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a className="nav-contact" href="#contact">
            Let’s talk <Arrow />
          </a>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">
              A human touch.
              <br />
              <span>An onchain world.</span>
            </h1>
            <p>
              I’m Kaito, an independent designer & developer
              <br className="desktop-break" /> creating thoughtful Web3
              experiences.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contact">
                Get in touch <Arrow />
              </a>
              <a className="work-link" href="#work">
                Explore my work <Arrow direction="down" />
              </a>
            </div>
            <div className="hero-note">
              <span className="status-dot" aria-hidden="true" />
              Independent spirit, collaborative approach
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <img src="./artwork/loop.svg" alt="" width="560" height="490" />
            <span className="art-caption">
              A little perspective changes everything
            </span>
            <span className="art-coordinate">( 01 / ∞ )</span>
          </div>
        </section>
        <section
          className="work-section shell"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="work-title">
                Selected work<span className="heading-dot">.</span>
              </h2>
              <p>Recent explorations in design and development.</p>
            </div>
            <span className="section-aside">
              Self-initiated concepts <span aria-hidden="true">↙</span>
            </span>
          </div>
          <div className="project-grid">
            {projects.map((item) => (
              <article className="project" key={item.id}>
                <button
                  className={`project-art project-${item.id}`}
                  onClick={() => setProject(item)}
                  aria-label={`View ${item.name} project`}
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    width="900"
                    height="640"
                    loading="lazy"
                  />
                  <span className="project-open" aria-hidden="true">
                    <Arrow />
                  </span>
                </button>
                <div className="project-caption">
                  <div>
                    <h3>
                      <button
                        onClick={() => setProject(item)}
                        className="project-title"
                      >
                        {item.name} <Arrow />
                      </button>
                    </h3>
                    <p>{item.kind}</p>
                  </div>
                  <div className="project-tags">
                    {item.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          className="about-section shell"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="about-intro">
            <div className="about-title-wrap">
              <svg
                className="asterisk"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                aria-hidden="true"
              >
                <path d="M20 0v40M0 20h40M6 6l28 28M6 34 34 6" />
              </svg>
              <h2 id="about-title">
                Curious mind.
                <br />
                Careful craft.
              </h2>
            </div>
            <div className="about-copy">
              <p>
                I like making complex things feel simple. Especially when it
                comes to the web’s next chapter.
              </p>
              <p>
                Working across design and code, I bring a thoughtful eye and a
                hands-on approach to every idea. From a first sketch to the last
                interaction, the details matter.
              </p>
              <a
                className="inline-link"
                href="https://x.com/kaito19_8"
                target="_blank"
                rel="noopener noreferrer"
              >
                <XIcon />
                Find me at @kaito19_8 <Arrow />
                <span className="sr-only"> (new tab)</span>
              </a>
            </div>
          </div>
          <div className="skill-list">
            {skills.map((skill) => (
              <div className="skill" key={skill.number}>
                <span className="skill-number">{skill.number}</span>
                <div>
                  <h3>{skill.title}</h3>
                  <p>{skill.description}</p>
                  <div className="tag-list">
                    {skill.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="contact-inner shell">
            <div className="contact-copy">
              <h2 id="contact-title">
                Have a good idea?
                <br />
                <span>Let’s make it real.</span>
              </h2>
              <p>
                A new project, a collaboration, or just a hello.
                <br />
                I’d love to hear what you have in mind.
              </p>
              <a
                className="inline-link"
                href="https://x.com/kaito19_8"
                target="_blank"
                rel="noopener noreferrer"
              >
                <XIcon />
                @kaito19_8 <Arrow />
                <span className="sr-only"> (new tab)</span>
              </a>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <footer className="site-footer shell">
        <a className="brand" href="#" aria-label="Kaito, back to top">
          <Mark />
          <span>kaito.</span>
        </a>
        <p>Thoughtfully designed. Carefully built.</p>
        <a href="#" className="back-to-top">
          Back to top <Arrow direction="down" />
        </a>
      </footer>
      <ProjectDialog project={project} onClose={() => setProject(null)} />
    </>
  )
}
