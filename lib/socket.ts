import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

interface InitSocketParams {
  name: string
  token: string
}

export const initSocket = ({ name, token }: InitSocketParams): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_WS_URL as string, {
      auth: { name, token },
      transports: ["websocket"],
    })
  }
  return socket
}

export const getSocket = (): Socket | null => socket

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
