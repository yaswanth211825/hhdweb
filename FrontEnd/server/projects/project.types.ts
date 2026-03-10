export type ProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"

export type ProjectVisibility = "PUBLIC" | "PAID"

export interface ProjectSummary {
  id: string
  title: string
  type: string
  plotSize: string
  location: string
  year: number
  status: ProjectStatus
  visibility: ProjectVisibility
  floorPlanImageUrl: string
}

