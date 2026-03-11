"use client"

declare const process: {
  env: Record<string, string | undefined>
}

export const BACKEND_BASE_URL =
  (process.env.NEXT_PUBLIC_WHISPER_API_URL || "").replace(/\/+$/, "")

export function backendUrl(path: string) {
  if (!BACKEND_BASE_URL) {
    throw new Error("NEXT_PUBLIC_WHISPER_API_URL is not configured.")
  }
  if (!path.startsWith("/")) return `${BACKEND_BASE_URL}/${path}`
  return `${BACKEND_BASE_URL}${path}`
}

export async function fetchJson<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, init)
  if (res.ok) return (await res.json()) as T
  let detail = res.statusText
  try {
    const j = await res.json()
    if (j?.detail) detail = j.detail
  } catch {
    // ignore
  }
  throw new Error(detail)
}

