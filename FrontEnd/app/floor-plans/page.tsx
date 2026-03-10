import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingPlaygroundButton } from "@/components/floating-playground-button"
import { FloorPlansClient } from "./floor-plans-client"
import { getCategories, getProjects } from "@/lib/api"

export const dynamic = "force-dynamic"

export default async function FloorPlansPage() {
  const [categoriesResult, projectsResult] = await Promise.allSettled([
    getCategories(),
    getProjects({ size: 100 }),
  ])

  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : []
  const projects =
    projectsResult.status === "fulfilled" ? projectsResult.value.data.content : []

  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <FloorPlansClient categories={categories} projects={projects} />
      <Footer />
      <FloatingPlaygroundButton />
    </main>
  )
}
