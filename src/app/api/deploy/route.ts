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
                gitSource: {
                    type: "github",
                    repo: "https://github.com/Yogesh1290/store-deploy-test", // ✅ Replace with your actual repo
                    ref: "main", // Optional: branch name
                },
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return NextResponse.json({ success: true, url: data.url });
        } else {
            return NextResponse.json({ success: false, error: data.error?.message || "Deployment failed" }, { status: 400 });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ success: false, error: "An unknown error occurred." }, { status: 500 });
        }
    }
}
