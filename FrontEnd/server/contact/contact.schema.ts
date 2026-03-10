import { z } from "zod"

export const contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone is required"),
  message: z.string().min(10, "Please provide a bit more detail."),
})

export type ContactMessageInput = z.infer<typeof contactMessageSchema>

