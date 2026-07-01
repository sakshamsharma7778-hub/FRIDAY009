"use client";

import { useEffect, useState } from "react";

type ChatMessage = {
  role: "user" | "friday";
  text: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [memory, setMemory] = useState("");

  useEffect(() => {
    const savedMemory = localStorage.getItem("friday_memory");
    if (savedMemory) setMemory(savedMemory);
  }, []);

  function saveMemory() {
    localStorage.setItem("friday_memory", memory);
    alert("Memory saved.");
  }

  function speak(text: string) {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    window.speechSynthesis.speak(speech);
  }

  async function sendToFriday(text: string) {
    if (!text.trim()) return;

    setChat((prev) => [...prev, { role: "user", text }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, memory }),
      });

      const data = await res.json();
      const reply = data.reply || "No response received.";

      setChat((prev) => [...prev, { role: "friday", text: reply }]);
      speak(reply);
    } catch {
      const errorReply = "Network issue, Saksham. Try again in a moment.";
      setChat((prev) => [...prev, { role: "friday", text: errorReply }]);
      speak(errorReply);
    }

    setLoading(false);
  }

  function startVoice() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      sendToFriday(text);
    };
  }

  return (
    <main style={{ minHeight: "100vh", background: "#050505", color: "white", fontFamily: "Arial", display: "flex", flexDirection: "column", padding: "20px" }}>
      <header style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0 }}>FRIDAY</h1>
        <p style={{ opacity: 0.7 }}>Online. Listening. Mostly patient.</p>
      </header>

      <section style={{ maxWidth: "700px", width: "100%", margin: "0 auto 20px" }}>
        <textarea
          value={memory}
          onChange={(e) => setMemory(e.target.value)}
          placeholder="Memory: Tell FRIDAY what to remember about you..."
          style={{ width: "100%", minHeight: "80px", padding: "12px", borderRadius: "10px", background: "#111", color: "white", border: "1px solid #333" }}
        />
        <button onClick={saveMemory} style={{ marginTop: "8px", padding: "8px 14px" }}>
          Save Memory
        </button>
      </section>

      <section style={{ flex: 1, maxWidth: "700px", width: "100%", margin: "0 auto", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
        {chat.length === 0 && <p style={{ textAlign: "center", opacity: 0.6 }}>Hello Saksham. Ask me anything.</p>}

        {chat.map((item, index) => (
          <div key={index} style={{ alignSelf: item.role === "user" ? "flex-end" : "flex-start", background: item.role === "user" ? "#1f6feb" : "#222", padding: "12px 14px", borderRadius: "14px", maxWidth: "80%", lineHeight: "1.4" }}>
            {item.text}
          </div>
        ))}

        {loading && <div style={{ alignSelf: "flex-start", background: "#222", padding: "12px 14px", borderRadius: "14px", opacity: 0.8 }}>FRIDAY is thinking...</div>}
      </section>

      <div style={{ maxWidth: "700px", width: "100%", margin: "20px auto 0", display: "flex", gap: "8px" }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendToFriday(message);
          }}
          placeholder="Ask FRIDAY..."
          style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #333", background: "#111", color: "white" }}
        />
        <button onClick={startVoice} style={{ padding: "12px" }}>🎤</button>
        <button onClick={() => sendToFriday(message)} style={{ padding: "12px" }}>Send</button>
      </div>

      <button onClick={() => setChat([])} style={{ margin: "12px auto 0", padding: "8px 14px", background: "#111", color: "white", border: "1px solid #333", borderRadius: "8px" }}>
        Clear Chat
      </button>
    </main>
  );
}