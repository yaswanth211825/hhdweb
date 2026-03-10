import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { UnderDevelopment } from "@/components/under-development"

export default function GalleryPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <UnderDevelopment
        title="Gallery"
        description="Our project photo gallery is being built. Soon you'll browse completed homes with full S3-hosted image collections."
      />
      <Footer />
    </main>
  )
}
