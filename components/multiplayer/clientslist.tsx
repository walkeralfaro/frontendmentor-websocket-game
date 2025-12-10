import { Button } from "../ui/button"

export interface Client {
  id: string
  name: string
  token: string
}

export function ClientsList({
  clients,
  handleClick,
}: {
  clients: Client[],
  handleClick: (client: Client) => void
}) {

  console.log(JSON.parse(localStorage.getItem('mp-user')!).token)
  console.log(clients)
  return (
    <ul className="space-y-2">
      {clients.map(client => (
        <li key={client.id}>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => handleClick(client)}
            disabled={client.token === JSON.parse(localStorage.getItem('mp-user')!).token }
          >
            {client.name}
          </Button>
        </li>
      ))}
    </ul>
  )
}

