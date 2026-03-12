import { useState } from "react";
import type { Event } from "../types/Events";
import { useRef, useEffect } from "react";

type Props = {
  event: Event;
  onClose: () => void;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPanel({ event, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm the guide for ${event.name}. Ask me anything about this event.`,
    },
  ]);

  const [input, setInput] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");

    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event,
        messages: newMessages,
      }),
    });

    const data = await response.json();

    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
  };

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: 380,
        height: "100vh",
        background: "linear-gradient(180deg,#0f172a,#020617)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* header */}
      <div
        style={{
          padding: 18,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "none",
            color: "#60a5fa",
            padding: "6px 10px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <div>
          <h3 style={{ margin: 0 }}>{event.name}</h3>
          <small>{event.location}</small>
        </div>
      </div>

      {/* messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background:
                m.role === "user"
                  ? "linear-gradient(135deg,#3b82f6,#2563eb)"
                  : "rgba(255,255,255,0.05)",
              padding: "10px 14px",
              borderRadius: 14,
              maxWidth: "75%",
              lineHeight: 1.4,
            }}
          >
            {m.content}
          </div>
        ))}
      </div>
      <div ref={bottomRef} />

      {/* input */}
      <div
        style={{
          padding: 12,
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          gap: 8,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "8px 12px",
            background: "#3b82f6",
            border: "none",
            borderRadius: 6,
            color: "white",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
