
import { RoomClient } from "@/components/room/roomclient"

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const { roomId } = params

  return (
    <main>
      <h1>Room: {roomId}</h1>
      <RoomClient roomId={roomId} />
    </main>
  )
}


