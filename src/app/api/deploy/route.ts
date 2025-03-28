import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ success: false, error: "Vercel Token is required!" }, { status: 400 });
        }

        const response = await fetch("https://api.vercel.com/v13/deployments", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "test-deployment",
                gitSource: { type: "github", repo: "your-repo-name" }, // Change to your repo
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return NextResponse.json({ success: true, url: data.url });
        } else {
            return NextResponse.json({ success: false, error: data.error.message }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
