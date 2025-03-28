import { useState } from "react";

export default function Home() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const deployApp = async () => {
    setMessage("Deploying...");
    const res = await fetch("/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Vercel Token Deployment</h1>
      <input
        type="text"
        placeholder="Enter Vercel Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />
      <br /><br />
      <button onClick={deployApp} style={{ padding: "10px 20px", cursor: "pointer" }}>
        Deploy to Vercel
      </button>
      <p>{message}</p>
    </div>
  );
}
