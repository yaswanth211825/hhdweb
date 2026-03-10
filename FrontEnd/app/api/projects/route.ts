import type { NextRequest } from "next/server"
import { handleApi } from "@/server/core/http"
import { rateLimitOrThrow } from "@/server/core/rate-limit"
import { getAllProjects } from "@/server/projects/project.service"

export async function GET(req: NextRequest) {
  return handleApi(async () => {
    rateLimitOrThrow(req)
    const projects = await getAllProjects()
    return { projects }
  })
}

