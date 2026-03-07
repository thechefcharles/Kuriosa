import { NextResponse } from "next/server";

interface HealthResponse {
  status: "ok";
  app: string;
  timestamp: string;
}

export async function GET() {
  const body: HealthResponse = {
    status: "ok",
    app: "Kuriosa",
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body);
}
