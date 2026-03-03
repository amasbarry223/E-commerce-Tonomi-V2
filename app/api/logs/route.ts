/**
 * API Route pour les logs
 */

import { NextResponse } from "next/server"
import { getLogs, getRecentLogs } from "@/lib/services/logs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const skip = searchParams.get("skip")
    const take = searchParams.get("take")
    const action = searchParams.get("action")
    const entityType = searchParams.get("entityType")
    const recent = searchParams.get("recent")

    if (recent === "true") {
      const limit = take ? parseInt(take, 10) : 50
      const logs = await getRecentLogs(limit)
      return NextResponse.json(logs)
    }

    const logs = await getLogs({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      action: action || undefined,
      entityType: entityType || undefined,
    })
    return NextResponse.json(logs)
  } catch (error) {
    console.error("Error fetching logs:", error)
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    )
  }
}
