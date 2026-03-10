import { ApiError } from "@/server/core/http"
import { findProjectById, listProjects } from "./project.repository"
import type { ProjectSummary } from "./project.types"

export async function getAllProjects(): Promise<ProjectSummary[]> {
  return listProjects()
}

export async function getProjectOrThrow(id: string): Promise<ProjectSummary> {
  const project = await findProjectById(id)
  if (!project) {
    throw new ApiError(404, "PROJECT_NOT_FOUND", "Project not found.")
  }
  return project
}

