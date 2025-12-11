'use client'

import { Client, ClientsList } from "@/components/multiplayer/clientslist"
import { Button } from "@/components/ui/button"
import { useSocketEvent } from "@/hooks/useSocketEvent"
import { disconnectSocket, getSocket, initSocket } from "@/lib/socket"
import { Loader } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

export default function Multiplayer() {

  const router = useRouter()
  const searchParams = useSearchParams()
  const roomId = searchParams.get("room")

  const [isLoading, setIsLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [messages, setMessages] = useState<{ name: string; message: string }[]>([])
  const messageRef = useRef<HTMLInputElement>(null)

  // ============================================================
  // 1) Conectar socket 1 sola vez
  // ============================================================

  useEffect(() => {
    const user = localStorage.getItem('mp-user')
    if (!user) {
      router.push('/')
      return
    }

    const { name, token } = JSON.parse(user)
    const socket = initSocket({ name, token })

    socket.on("connect", () => {
      console.log("CLIENTE: Conectado!")
      setIsLoading(false)
    })

    // mensaje de bienvenida
    socket.on("welcome-message", (msg) => {
      toast.success(msg)
    })

    // errores de invitación
    socket.on("invite-error", ({ message }) => {
      toast.error(message)
    })

    socket.on("invite-sent", () => {
      toast.success(`Invitación enviada`)
    })

    return () => {
      socket.off("welcome-message")
      socket.off("invite-error")
      socket.off("invite-sent")
      disconnectSocket()
    }
  }, [])



  // ============================================================
  // 2) Cerrar sesión
  // ============================================================

  const handleDisconnect = () => {
    localStorage.removeItem('mp-user')
    disconnectSocket()
    router.push('/')
  }



  // ============================================================
  // 3) Lista de clientes conectados
  // ============================================================

  useSocketEvent<Client[]>("on-clients-changed", (clients) => {
    setClients(clients)
  })



  // ============================================================
  // 4) Invitar
  // ============================================================

  const handleClientClick = (client: Client) => {
    if (roomId) return
    const socket = getSocket()
    socket?.emit('send-invite', { toId: client.id })
  }



  // ============================================================
  // 5) Recibir invitación
  // ============================================================

  useSocketEvent('receive-invite', ({ fromId, fromName }) => {
    if (roomId) return

    toast(`Invitación de: ${fromName}`, {
      duration: 10000,
      action: {
        label: 'Aceptar',
        onClick: () => {
          const socket = getSocket()
          socket?.emit('accept-invite', { fromId })
        }
      },
    })
  })



  // ============================================================
  // 6) Al crear room → redirigir
  // ============================================================

  useSocketEvent("room-ready", ({ roomId }) => {
    router.push(`/multiplayer?room=${roomId}`, { scroll: false })
  })



  // ============================================================
  // 7) Unirse al room
  // ============================================================

  useEffect(() => {
    const socket = getSocket()
    if (!socket || !roomId) return

    socket.emit("join-room", { roomId })

    socket.on("room-joined", () => {
      console.log("Estás dentro del room confirmado por el servidor")
    })

    socket.on("room-error", (msg) => {
      toast.error(msg)
      router.push("/multiplayer")
    })

    return () => {
      socket.off("room-joined")
      socket.off("room-error")
    }
  }, [roomId])



  // ============================================================
  // 8) Mensajes del chat
  // ============================================================

  useSocketEvent("on-room-message", ({ name, message }) => {
    setMessages(prev => [...prev, { name, message }])
  })



  // ============================================================
  // 9) Cuando el otro jugador se desconecta
  // ============================================================

  useSocketEvent("player-disconnected", ({ message }) => {
    toast.error(message)
    setMessages([])
    router.push("/multiplayer")
  })



  // ============================================================
  // 10) Enviar mensaje
  // ============================================================

  const sendMessage = () => {
    const text = messageRef.current?.value.trim()
    if (!text || !roomId) return

    const socket = getSocket()
    socket?.emit("send-message", { roomId, message: text })

    if (messageRef.current) messageRef.current.value = ""
  }



  // ============================================================
  //  UI
  // ============================================================

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Conectando <Loader className="animate-spin w-6 h-6 ml-2" />
      </div>
    )
  }

  return (
    <div className="p-10 flex flex-col items-center gap-4 min-h-screen">

      {!roomId && (
        <>
          <h1 className="text-3xl font-bold">Multiplayer conectado</h1>
          <ClientsList clients={clients} handleClick={handleClientClick} />
        </>
      )}

      {roomId && (
        <div className="w-full max-w-xl flex flex-col gap-4">

          <div className="text-xl font-bold text-center">
            Estás dentro del room: {roomId}
          </div>

          {/* CHAT */}
          <div className="border rounded p-4 h-80 overflow-y-auto bg-muted/40">
            {messages.map((m, i) => (
              <div key={i} className="mb-2">
                <strong>{m.name}:</strong> {m.message}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              ref={messageRef}
              className="border rounded p-2 flex-1"
              placeholder="Escribe un mensaje..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage}>Enviar</Button>
          </div>

          <Button
            variant="secondary"
            onClick={() => {
              const socket = getSocket()
              socket?.emit("leave-room", { roomId })
              setMessages([])
              router.push("/multiplayer")
            }}
          >
            Salir del room
          </Button>
        </div>
      )}

      <Button variant="destructive" onClick={handleDisconnect}>
        Desconectar
      </Button>
    </div>
  )
}
