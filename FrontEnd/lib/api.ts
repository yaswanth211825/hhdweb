// ─── Types mirroring Spring Boot DTOs ────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
  timestamp: string
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export interface CategoryResponse {
  id: string
  name: string
  description: string | null
  createdAt: string
}

export interface ProjectSummary {
  id: string
  title: string
  slug: string
  location: string
  areaSqft: number | null
  yearCompleted: number | null
  coverImageUrl: string | null
  status: string
  categoryName: string | null
}

export interface ProjectFileResponse {
  id: string
  fileUrl: string
  fileType: string
  title: string | null
  displayOrder: number
}

export interface ProjectDetail {
  id: string
  title: string
  slug: string
  location: string
  areaSqft: number | null
  yearCompleted: number | null
  description: string | null
  coverImageUrl: string | null
  status: string
  category: CategoryResponse | null
  files: ProjectFileResponse[]
  createdAt: string
}

export interface EnquiryBody {
  name: string
  email: string
  phone?: string
  message?: string
  projectId?: string
}

export interface EnquiryResponse {
  id: string
  name: string
  email: string
  phone: string | null
  message: string | null
  status: string
  createdAt: string
}

// ─── Base URL (SSR uses Spring URL directly, browser uses Next rewrite) ───────
const BASE =
  typeof window === "undefined"
    ? `${process.env.SPRING_API_URL ?? "http://localhost:8080"}/api`
    : "/backend/api"

async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    // Don't cache by default — keep it simple for Sprint 1
    cache: "no-store",
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.message ?? `Request failed with status ${res.status}`)
  }

  return res.json()
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function getCategories(): Promise<CategoryResponse[]> {
  const resp = await apiFetch<CategoryResponse[]>("/categories")
  return resp.data
}

export interface GetProjectsParams {
  categoryId?: string
  page?: number
  size?: number
}

export async function getProjects(
  params: GetProjectsParams = {}
): Promise<ApiResponse<PagedResponse<ProjectSummary>>> {
  const { categoryId, page = 0, size = 50 } = params
  const qs = new URLSearchParams({ page: String(page), size: String(size) })
  if (categoryId) qs.set("categoryId", categoryId)
  return apiFetch<PagedResponse<ProjectSummary>>(`/projects?${qs}`)
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail> {
  const resp = await apiFetch<ProjectDetail>(`/projects/${slug}`)
  return resp.data
}

export async function submitEnquiry(body: EnquiryBody): Promise<EnquiryResponse> {
  const resp = await apiFetch<EnquiryResponse>("/requests", {
    method: "POST",
    body: JSON.stringify(body),
  })
  return resp.data
}
