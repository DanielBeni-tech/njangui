export function NjangiLogo({ className }: { className?: string }) {
  // A circular motif of connected people — a community ring.
  const nodes = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
    return {
      x: 24 + Math.cos(angle) * 15,
      y: 24 + Math.sin(angle) * 15,
    }
  })

  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Logo Njangi : un cercle de personnes reliées"
      className={className}
      fill="none"
    >
      {/* connecting ring */}
      <circle cx="24" cy="24" r="15" stroke="var(--color-mint)" strokeWidth="2.5" />
      {/* links between people */}
      {nodes.map((n, i) => {
        const next = nodes[(i + 1) % nodes.length]
        return (
          <line
            key={`l-${i}`}
            x1={n.x}
            y1={n.y}
            x2={next.x}
            y2={next.y}
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.55"
          />
        )
      })}
      {/* people */}
      {nodes.map((n, i) => (
        <g key={`p-${i}`}>
          <circle cx={n.x} cy={n.y - 2.6} r="2.5" fill="var(--color-primary)" />
          <path
            d={`M ${n.x - 3.4} ${n.y + 4.2} q 3.4 -4 6.8 0 z`}
            fill="var(--color-primary)"
          />
        </g>
      ))}
    </svg>
  )
}
