"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, SlidersHorizontal, Maximize, Eye, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { CategoryResponse, ProjectSummary } from "@/lib/api"

interface Props {
  categories: CategoryResponse[]
  projects: ProjectSummary[]
}

export function FloorPlansClient({ categories, projects }: Props) {
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState("all")
  const [minArea, setMinArea] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const area = minArea ? parseInt(minArea) : null
    const cat = categoryId !== "all" ? categoryId : null

    return projects.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q))
        return false
      if (cat && p.id !== cat) {
        // Filter by categoryName match (we don't have categoryId on summary, match by name)
        const catName = categories.find((c) => c.id === cat)?.name
        if (catName && p.categoryName !== catName) return false
      }
      if (area !== null && (p.areaSqft ?? 0) < area) return false
      return true
    })
  }, [projects, search, categoryId, minArea, categories])

  const hasFilters = search !== "" || categoryId !== "all" || minArea !== ""

  const clearFilters = () => {
    setSearch("")
    setCategoryId("all")
    setMinArea("")
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
          Floor Plan Finder
        </h1>
        <p className="text-muted-foreground">
          Discover the perfect floor plan for your plot dimensions and requirements.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-6 mb-8">
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <span className="font-semibold">Filters</span>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {showFilters ? "Hide" : "Show"}
          </Button>
        </div>

        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title or location…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Min Area */}
            <div className="space-y-2">
              <Label htmlFor="minArea">Min Area (sq ft)</Label>
              <Input
                id="minArea"
                type="number"
                placeholder="e.g. 1200"
                value={minArea}
                onChange={(e) => setMinArea(e.target.value)}
              />
            </div>
          </div>

          {hasFilters && (
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">{filtered.length}</span> floor plans
        </p>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((plan) => (
            <Link key={plan.id} href={`/floor-plans/${plan.slug}`}>
              <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300 h-full">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {plan.coverImageUrl ? (
                    <Image
                      src={plan.coverImageUrl}
                      alt={plan.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      No image
                    </div>
                  )}
                  {plan.categoryName && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                        {plan.categoryName}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-accent-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Plan
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {plan.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-1">
                    {plan.areaSqft && (
                      <span className="flex items-center gap-1">
                        <Maximize className="w-3.5 h-3.5" />
                        {plan.areaSqft.toLocaleString()} sq ft
                      </span>
                    )}
                  </div>
                  {plan.location && (
                    <p className="text-xs text-muted-foreground">{plan.location}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg text-foreground mb-2">No floor plans found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters.</p>
          {hasFilters && (
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
