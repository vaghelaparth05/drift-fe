import { useState, useEffect } from "react"
import type { Event } from "../types/Events"

type Props = {
  event: Event
  onClick: (event: Event) => void
}

export default function EventMarker({ event, onClick }: Props) {

  const [isHovered, setIsHovered] = useState(false)

  // used to refresh timer automatically
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((n) => n + 1)
    }, 60000) // refresh every minute

    return () => clearInterval(interval)
  }, [])

  const getEventStatus = () => {

    const now = new Date()
    const start = new Date(event.startTime)
    const end = new Date(event.endTime)

    if (now >= start && now <= end) {
      return { label: "LIVE NOW", color: "#22c55e" }
    }

    if (now < start) {

      const diff = start.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))

      if (hours < 1) {
        return { label: "Starting soon", color: "#f59e0b" }
      }

      return { label: `Starts in ${hours}h`, color: "#3b82f6" }
    }

    return { label: "Ended", color: "#6b7280" }
  }

  const status = getEventStatus()

  const getIcon = () => {
    switch (event.id) {
      case "f1":
        return "🏎️"
      case "moomba":
        return "🎆"
      case "nightmarket":
        return "🍜"
      case "comedy":
        return "🎤"
      case "chadstone":
        return "🛍️"
      case "stkilda":
        return "🌮"
      default:
        return "📍"
    }
  }

  return (
    <div
      onClick={() => onClick(event)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        cursor: "pointer",
        transform: "translate(-50%, -50%)"
      }}
    >

      {/* Timer badge */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: "50%",
          transform: "translateX(-50%)",
          background: status.color,
          color: "white",
          padding: "4px 8px",
          borderRadius: 6,
          fontSize: 10,
          fontWeight: 600,
          whiteSpace: "nowrap"
        }}
      >
        {status.label}
      </div>

      {/* Hover preview */}
      {isHovered && (
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.85)",
            color: "white",
            padding: "8px 12px",
            borderRadius: 8,
            whiteSpace: "nowrap",
            fontSize: 12,
            pointerEvents: "none"
          }}
        >
          <div style={{ fontWeight: 600 }}>{event.name}</div>
          <div style={{ opacity: 0.7 }}>{event.location}</div>
        </div>
      )}

      {/* Glow ring */}
      <div
        style={{
          position: "absolute",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "rgba(255,59,48,0.25)",
          animation: "pulse 2s infinite"
        }}
      />

      {/* Marker */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "#ff3b30",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          color: "white",
          boxShadow: "0 0 12px rgba(0,0,0,0.4)"
        }}
      >
        {getIcon()}
      </div>

    </div>
  )
}