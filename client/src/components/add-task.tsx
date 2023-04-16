"use client"

import { FormEvent, useState } from "react"
import * as io from "socket.io-client"

interface Props {
  socket: io.Socket
}

export default function AddTask({ socket }: Props) {
  const [task, setTask] = useState("")

  const handleTask = (e: FormEvent) => {
    e.preventDefault()
    console.log(task)

    socket.emit("createTask", {task})
    setTask("")
  }

  return (
    <form 
    className="h-10 w-screen flex justify-center space-x-3" 
    onSubmit={handleTask}
    >
        <input
          type="text"
          required
          value={task}
          placeholder="example task name"
          className="rounded-md border-none text-zinc-800 px-2"
          onChange={(e) => setTask(e.target.value)}
          onClick={() => console.log(task)}
        />
        <button className="rounded-md border-none bg-zinc-600 text-gray-300 px-2">
          add task
        </button>
      </form>
  )
}