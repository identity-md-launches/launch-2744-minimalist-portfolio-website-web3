import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Arrow, XIcon } from './Icons'

type Errors = Partial<Record<'name' | 'email' | 'message', string>>

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const readyRef = useRef<HTMLHeadingElement>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState('')

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const message = String(data.get('message') || '').trim()
    const next: Errors = {}
    if (!name) next.name = 'Add your name so Kaito knows who to reply to.'
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = 'Enter a full email address, or leave this blank.'
    if (message.length < 20)
      next.message = 'Add at least 20 characters about your project.'
    setErrors(next)
    setStatus('')
    if (Object.keys(next).length) {
      const field = Object.keys(next)[0]
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>(`[name="${field}"]`)
          ?.focus(),
      )
      return
    }
    setDraft(
      `Hi Kaito, I’m ${name}.\n\n${message}${email ? `\n\nYou can reach me at ${email}.` : ''}`,
    )
    requestAnimationFrame(() => readyRef.current?.focus())
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(draft)
      setStatus(
        'Message copied. Open X and paste it into a private message to @kaito19_8.',
      )
    } catch {
      setStatus(
        'Clipboard is unavailable. Select and copy the message below, or download it as a text file.',
      )
    }
  }

  function downloadMessage() {
    const url = URL.createObjectURL(
      new Blob([draft], { type: 'text/plain;charset=utf-8' }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'message-for-kaito.txt'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus('Message downloaded. Send it privately to @kaito19_8 on X.')
  }

  return (
    <div className="contact-form-wrap">
      <form ref={formRef} onSubmit={prepare} noValidate hidden={Boolean(draft)}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="contact-name">
              Your name <span>(required)</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={100}
              placeholder="Alex"
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p className="field-error" id="name-error">
                {errors.name}
              </p>
            )}
          </div>
          <div className="field">
            <label htmlFor="contact-email">
              Email <span>(optional)</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              maxLength={254}
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p className="field-error" id="email-error">
                {errors.email}
              </p>
            )}
          </div>
        </div>
        <div className="field">
          <label htmlFor="contact-message">
            What are you working on? <span>(required)</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            minLength={20}
            required
            maxLength={3000}
            placeholder="A little about your idea, timeline, and what you need help with…"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? 'message-error message-hint' : 'message-hint'
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault()
                formRef.current?.requestSubmit()
              }
            }}
          />
          {errors.message && (
            <p className="field-error" id="message-error">
              {errors.message}
            </p>
          )}
        </div>
        <div className="form-bottom">
          <button type="submit" className="button button-primary">
            Prepare message <Arrow />
          </button>
          <p id="message-hint">
            At least 20 characters. Copy, then send on X.
            <br />
            Nothing is sent from this website.
          </p>
        </div>
      </form>
      <div className="message-ready" hidden={!draft}>
        <h3 ref={readyRef} tabIndex={-1}>
          Your message is ready
        </h3>
        <p>
          Copy it, then send it privately to @kaito19_8 on X. If direct messages
          are closed, use the profile’s contact options.
        </p>
        <label htmlFor="prepared-message" className="sr-only">
          Prepared message
        </label>
        <textarea
          id="prepared-message"
          className="prepared-message"
          value={draft}
          readOnly
          rows={6}
        />
        <div className="ready-actions">
          <button
            className="button button-primary"
            type="button"
            onClick={copyMessage}
          >
            Copy message{' '}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="8" y="8" width="12" height="12" rx="2" />
              <path d="M16 8V4H4v12h4" />
            </svg>
          </button>
          <a
            className="button button-outline"
            href="https://x.com/kaito19_8"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open X <XIcon />
            <span className="sr-only"> (new tab)</span>
          </a>
        </div>
        <div className="draft-actions">
          <button
            className="text-button"
            type="button"
            onClick={() => {
              setDraft('')
              setStatus('')
              requestAnimationFrame(() =>
                formRef.current
                  ?.querySelector<HTMLInputElement>('[name="name"]')
                  ?.focus(),
              )
            }}
          >
            Edit message
          </button>
          <button
            className="text-button"
            type="button"
            onClick={downloadMessage}
          >
            Download as text
          </button>
        </div>
      </div>
      <p className="form-status" role="status">
        {status}
      </p>
    </div>
  )
}
