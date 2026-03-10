import type { ContactMessageInput } from "./contact.schema"

// For now this is a stub; later you can:
// - Store in Firestore
// - Or send to your email / CRM
export async function saveContactMessage(input: ContactMessageInput) {
  // eslint-disable-next-line no-console
  console.log("New contact message:", input)
  return { received: true }
}

