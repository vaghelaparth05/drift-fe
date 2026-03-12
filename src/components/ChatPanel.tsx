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
    right: 20,
    top: 20,
    width: 380,
    height: "92vh",
    backdropFilter: "blur(20px)",
    background: "rgba(28, 28, 28, 0.75)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  }}
>
  {/* header */}
  <div
    style={{
      padding: 18,
      display: "flex",
      alignItems: "center",
      gap: 12,
      backdropFilter: "blur(12px)",
      background: "rgba(255,255,255,0.03)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <button
      onClick={onClose}
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#60a5fa",
        padding: "6px 10px",
        borderRadius: 10,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      ←
    </button>

    <div>
      <h3 style={{ margin: 0, fontWeight: 600 }}>{event.name}</h3>
      <small style={{ opacity: 0.6 }}>{event.location}</small>
    </div>
  </div>

  {/* messages */}
  <div
    style={{
      flex: 1,
      overflowY: "auto",
      padding: 18,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    {messages.map((m, i) => (
      <div
        key={i}
        style={{
          alignSelf: m.role === "user" ? "flex-end" : "flex-start",
          background:
            m.role === "user"
              ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
              : "rgba(255,255,255,0.06)",
          backdropFilter: "blur(10px)",
          padding: "10px 16px",
          borderRadius: 16,
          maxWidth: "75%",
          lineHeight: 1.5,
          fontSize: 14,
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
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
      padding: 14,
      display: "flex",
      gap: 10,
      backdropFilter: "blur(12px)",
      background: "rgba(255,255,255,0.03)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Type a message..."
      style={{
        flex: 1,
        padding: 12,
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.05)",
        color: "white",
        outline: "none",
        backdropFilter: "blur(10px)",
      }}
    />

    <button
      onClick={sendMessage}
      style={{
        padding: "10px 16px",
        background: "linear-gradient(135deg,#3b82f6,#2563eb)",
        border: "none",
        borderRadius: 10,
        color: "white",
        fontWeight: 500,
        cursor: "pointer",
        boxShadow: "0 6px 18px rgba(37,99,235,0.4)",
      }}
    >
      Send
    </button>
  </div>
</div>
  );
}
