'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { generateToken } from '@/lib/utils'

export default function App() {

  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const router = useRouter()

  const handleOpenMultiplayer = () => {
    const session = localStorage.getItem('mp-user')

    if (session) {
      router.push('/multiplayer')
    } else {
      setOpen(true)
    }

  }

  const handleJoin = () => {
    if (!name.trim()) return

    const user = {
      name,
      token: generateToken()
    }

    localStorage.setItem('mp-user', JSON.stringify(user))
    router.push('/multiplayer')
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button onClick={handleOpenMultiplayer}>Multiplayer</Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ingresa nombre de usuario</DialogTitle>
            <DialogDescription>Debes ingresar un nombre de usuario para identificarte en el multijugador</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="username">Name</Label>
              <Input
                id="username"
                name="username"
                placeholder="Ingresa tu nombre..."
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleJoin}>Unirse</Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>
    </>
  )
}