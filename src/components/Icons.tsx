export function Arrow({
  direction = 'up-right',
  className = '',
}: {
  direction?: 'up-right' | 'right' | 'down'
  className?: string
}) {
  const paths = {
    'up-right': 'M5 19 19 5M5 5h14v14',
    right: 'M4 12h16m-7-7 7 7-7 7',
    down: 'M12 4v16m-7-7 7 7 7-7',
  }
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[direction]} />
    </svg>
  )
}

export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4 4h7v14L23 4h8L19 18l12 10h-10l-10-9v9H4z" />
    </svg>
  )
}

export function XIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-7.5L5.4 22H2.2l7.9-9L.8 2h6.5l4.5 6.9L18.9 2ZM17.8 20h1.7L6.3 3.9H4.5L17.8 20Z" />
    </svg>
  )
}
