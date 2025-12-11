


import { Suspense } from "react"
import MultiplayerSite from "./multiplayer-site"

export default function Multiplayer() {



  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MultiplayerSite />
    </Suspense>
  )
}