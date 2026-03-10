import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloorPlansClient } from "./floor-plans-client"
import { getAllProjects, getCategories } from "@/lib/api"

export const dynamic = "force-dynamic"

export default async function FloorPlansPage() {
  const [categoriesResult, projectsResult] = await Promise.allSettled([
    getCategories(),
    getAllProjects(),
  ])

  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : []
  const projects = projectsResult.status === "fulfilled" ? projectsResult.value : []

  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <FloorPlansClient categories={categories} projects={projects} />
      <Footer />
    </main>
  )
}
