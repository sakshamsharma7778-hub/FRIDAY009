"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  function speak(text: string) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    window.speechSynthesis.speak(speech);
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

    recognition.onresult = async (event: any) => {
  const text = event.results[0][0].transcript;
  setMessage(text);

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: text }),
  });

  const data = await res.json();
  setReply(data.reply);
  speak(data.reply);
};g
  }

  async function sendMessage() {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });GIT

    const data = await res.json();
    setReply(data.reply);
    speak(data.reply);
  }

  return (
    <main style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "black",
      color: "white",
      fontFamily: "Arial",
    }}>
      <h1>FRIDAY</h1>
      <h2>Hello Saksham</h2>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask FRIDAY anything..."
        style={{ padding: "10px", width: "300px", marginTop: "20px" }}
      />

      <button onClick={startVoice} style={{ marginTop: "10px", padding: "10px 20px" }}>
        🎤 Talk
      </button>

      <button onClick={sendMessage} style={{ marginTop: "10px", padding: "10px 20px" }}>
        Send
      </button>

      <p style={{ marginTop: "20px", maxWidth: "500px" }}>{reply}</p>
    </main>
  );
}