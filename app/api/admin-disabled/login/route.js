import { NextResponse } from "next/server";

export async function POST(req) {
  const { password } = await req.json();
  const correct = process.env.ADMIN_PASSWORD;

  if (!password || password !== correct) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const res = new NextResponse("OK", { status: 200 });

  // Simple cookie (you can add expires if you want)
  res.cookies.set("bob_admin_authed", "true", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return res;
}