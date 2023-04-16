"use client";

import AddTask from "@/components/add-task";
import Header from "@/components/header";
import TasksContainer from "@/components/tasks-container";
import * as io from "socket.io-client";

const socket: io.Socket = io.connect("http://localhost:5000");

export default function Tasks() {
  return (
    <div className="min-h-screen flex-col items-center justify-center space-y-8">
      <Header />
      <AddTask socket={socket} />
      <TasksContainer socket={socket} />
    </div>
  );
}
