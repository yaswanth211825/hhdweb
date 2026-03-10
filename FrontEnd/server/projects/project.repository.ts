import type { ProjectSummary } from "./project.types"

// Temporary in-memory data. Later this can be backed by Firestore.
const PROJECTS: ProjectSummary[] = [
  {
    id: "1",
    title: "Sunrise Villa",
    type: "4BHK Duplex",
    plotSize: "2400 sq ft",
    location: "Green Valley Estate",
    year: 2024,
    status: "PUBLISHED",
    visibility: "PAID",
    floorPlanImageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "2",
    title: "Compact Living",
    type: "2BHK Modern",
    plotSize: "1000 sq ft",
    location: "Urban Square",
    year: 2023,
    status: "PUBLISHED",
    visibility: "PUBLIC",
    floorPlanImageUrl: "/placeholder.svg?height=400&width=600",
  },
]

export async function listProjects(): Promise<ProjectSummary[]> {
  // Replace with Firestore query in future.
  return PROJECTS
}

export async function findProjectById(id: string): Promise<ProjectSummary | null> {
  return PROJECTS.find((p) => p.id === id) ?? null
}

