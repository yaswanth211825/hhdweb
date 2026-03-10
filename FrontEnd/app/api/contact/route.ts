import type { NextRequest } from "next/server"
import { handleApi, ApiError } from "@/server/core/http"
import { rateLimitOrThrow } from "@/server/core/rate-limit"
import { contactMessageSchema } from "@/server/contact/contact.schema"
import { saveContactMessage } from "@/server/contact/contact.service"

export async function POST(req: NextRequest) {
  return handleApi(async () => {
    rateLimitOrThrow(req)

    const body = await req.json().catch(() => {
      throw new ApiError(400, "INVALID_JSON", "Request body must be valid JSON.")
    })

    const parsed = contactMessageSchema.safeParse(body)
    if (!parsed.success) {
      throw new ApiError(400, "VALIDATION_ERROR", "Invalid contact data.", parsed.error.flatten())
    }

    const result = await saveContactMessage(parsed.data)
    return { ok: true, result }
  })
}

