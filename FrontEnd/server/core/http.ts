import { NextResponse } from "next/server"

export class ApiError extends Error {
  status: number
  code: string
  details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
  }
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status },
  )
}

export function fromApiError(error: ApiError) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    },
    { status: error.status },
  )
}

export async function handleApi<T>(fn: () => Promise<T> | T) {
  try {
    const data = await fn()
    return ok(data)
  } catch (err) {
    if (err instanceof ApiError) {
      return fromApiError(err)
    }

    console.error("Unhandled API error:", err)
    const safeError = new ApiError(500, "INTERNAL_ERROR", "Something went wrong. Please try again.")
    return fromApiError(safeError)
  }
}

