'use client'

import { getSocket } from "@/lib/socket"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function RoomClient({ roomId }: { roomId: string }) {
  const router = useRouter()

  useEffect(() => {
    const socket = getSocket()
    console.log("SOCKET:", socket)

    // if (!socket) {
    //   console.warn("Room acceso inválido. Redirigiendo.")
    //   router.push("/")
    //   return
    // }

    // socket.emit("join-room", { roomId })

    // socket.on("room-joined", (data) => {
    //   console.log("Unido a room:", data)
    // })

    // socket.on("room-error", () => {
    //   router.push("/")
    // })

  }, [roomId])

  return <div>Cliente en la sala: {roomId}</div>
}
