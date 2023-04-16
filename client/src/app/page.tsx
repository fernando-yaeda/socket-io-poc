"use client"

import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export default function Login() {
  const [username, setUsername] = useState("")
  const router = useRouter()
  
  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    localStorage.setItem("userId", username)
    setUsername("")
    router.push("/tasks")
  }
  
  return (
    <div className="h-screen flex items-center justify-center">
      <form className="flex flex-col items-center space-y-4" onSubmit={handleLogin} >
        <input 
          autoComplete="off"
          className="rounded-md border-none text-zinc-800 px-2"
          type="text"
          name="username"
          placeholder="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="py-2 px-4  w-auto rounded-md bg-zinc-800 text-gray-400">sign in</button>
      </form>
    </div>
  )
}
