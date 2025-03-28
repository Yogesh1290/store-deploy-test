"use client";
import { useState } from "react";

export default function Home() {
    const [token, setToken] = useState("");
    const [message, setMessage] = useState("");

    const deployApp = async () => {
        if (!token) {
            setMessage("Please enter a Vercel token!");
            return;
        }

        setMessage("Deploying...");

        try {
            const response = await fetch("/api/deploy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(`✅ Deployment started: ${data.url}`);
            } else {
                setMessage(`❌ Deployment failed: ${data.error}`);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMessage("Error deploying: " + error.message);
            } else {
                setMessage("An unknown error occurred during deployment.");
            }
        }
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Deploy to Another Vercel Account</h1>
            <input
                type="text"
                placeholder="Enter Vercel Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                style={{ padding: "10px", width: "300px" }}
            />
            <br />
            <br />
            <button onClick={deployApp} style={{ padding: "10px 20px", cursor: "pointer" }}>
                Deploy to Vercel
            </button>
            <p>{message}</p>
        </div>
    );
}
