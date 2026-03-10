import { useState } from "react"
import type { Event } from "../types/Events"

type Props = {
  event: Event
}

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function ChatPanel({ event }: Props) {

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm the guide for ${event.name}. Ask me anything about this event.`
    }
  ])

  const [input, setInput] = useState("")

  const sendMessage = async () => {

    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input
    }

    const newMessages = [...messages, userMessage]

    setMessages(newMessages)
    setInput("")

    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event,
        messages: newMessages
      })
    })

    const data = await response.json()

    setMessages([
      ...newMessages,
      { role: "assistant", content: data.reply }
    ])
  }

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: 380,
        height: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #1e293b"
      }}
    >
      {/* header */}
      <div style={{ padding: 16, borderBottom: "1px solid #1e293b" }}>
        <h3>{event.name}</h3>
        <small>{event.location}</small>
      </div>

      {/* messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#2563eb" : "#1e293b",
              padding: "8px 12px",
              borderRadius: 8,
              maxWidth: "80%"
            }}
          >
            {m.content}
          </div>
        ))}
      </div>

      {/* input */}
      <div
        style={{
          padding: 12,
          borderTop: "1px solid #1e293b",
          display: "flex",
          gap: 8
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 6,
            border: "none"
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "8px 12px",
            background: "#3b82f6",
            border: "none",
            borderRadius: 6,
            color: "white"
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}