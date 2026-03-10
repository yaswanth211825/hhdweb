"use client"

import { useState } from "react"
import { Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const videos = [
  {
    id: "video1",
    title: "30x40 2BHK House Plan",
    thumbnail: "https://img.youtube.com/vi/FFGpFmiRqZU/maxresdefault.jpg",
    youtubeId: "FFGpFmiRqZU",
  },
  {
    id: "video2",
    title: "Residential Building Design",
    thumbnail: "https://img.youtube.com/vi/RuwQrox9qE8/maxresdefault.jpg",
    youtubeId: "RuwQrox9qE8",
  },
  {
    id: "video3",
    title: "Modern House Elevation",
    thumbnail: "https://img.youtube.com/vi/A8PF4Y5uEoY/maxresdefault.jpg",
    youtubeId: "A8PF4Y5uEoY",
  },
]

export function VideoSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-medium text-accent uppercase tracking-wider">
            See Our Work
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4 text-balance">
            Watch Our Builds Come to Life
          </h2>
          <p className="text-muted-foreground">
            Explore our construction process and see the quality craftsmanship in every project.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <button
              key={video.id}
              onClick={() => setActiveVideo(video.youtubeId)}
              className="group relative aspect-video rounded-xl overflow-hidden bg-muted cursor-pointer"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-accent-foreground ml-1" />
                </div>
                <span className="mt-4 text-white font-medium text-balance px-4 text-center">{video.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Video Modal */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="w-full max-w-4xl aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
