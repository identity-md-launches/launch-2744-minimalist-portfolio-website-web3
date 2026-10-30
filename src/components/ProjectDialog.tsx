import { useEffect, useRef } from 'react'
import type { Project } from '../content'
import { Arrow } from './Icons'

export default function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    if (!project || !dialog) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    dialog.scrollTop = 0
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [project])

  return (
    <dialog
      ref={ref}
      className="project-dialog"
      aria-labelledby="project-title"
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const controls =
          event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]')
        const first = controls[0],
          last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect()
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose()
        }
      }}
    >
      {project && (
        <>
          <div className="dialog-top">
            <span>Self-initiated concept</span>
            <button
              className="icon-button close-button"
              onClick={onClose}
              aria-label="Close project"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="m6 6 12 12M6 18 18 6" />
              </svg>
            </button>
          </div>
          <div className="dialog-intro">
            <h2 id="project-title">{project.name}</h2>
            <p>{project.summary}</p>
          </div>
          <img
            className="dialog-art"
            src={project.image}
            alt={project.alt}
            width="900"
            height="640"
          />
          <div className="dialog-copy">
            <p>{project.description}</p>
            <h3>The challenge</h3>
            <p>{project.challenge}</p>
            <h3>The approach</h3>
            <p>{project.approach}</p>
            <h3>Scope</h3>
            <p>{project.scope}</p>
            <div className="tag-list">
              {project.tools.map((tool) => (
                <span className="tag" key={tool}>
                  {tool}
                </span>
              ))}
            </div>
            <a
              href="#contact"
              className="button button-primary"
              onClick={() => {
                onClose()
                requestAnimationFrame(() =>
                  document
                    .getElementById('contact-name')
                    ?.focus({ preventScroll: true }),
                )
              }}
            >
              Discuss a similar project <Arrow />
            </a>
          </div>
        </>
      )}
    </dialog>
  )
}
