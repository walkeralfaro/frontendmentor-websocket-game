// /hooks/useSocketEvent.ts
import { useEffect } from "react"
import { getSocket } from "@/lib/socket"

export function useSocketEvent<T = any>(
  event: string,
  handler: (data: T) => void
) {
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    socket.on(event, handler)

    return () => {
      socket.off(event, handler)
    }
  }, [event, handler])
}

