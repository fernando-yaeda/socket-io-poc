import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import crypto from "node:crypto"

const app = express();
const PORT = 5000;

const randomID = () => crypto.randomInt(1,9999)

let tasks = {
  pending: {
    title: "pending",
    items: [
      {
        id: randomID(),
        title: "Something to do",
      },
    ],
  },
  done: {
    title: "done",
    items: [
      {
        id: randomID(),
        title: "Something is done",
      },
    ],
  },
};

app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(cors());

app.get("/health", (req, res) => {
  res.json({
    message: "Ok!",
  });
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

io.on("connection", (socket) => {
  console.log(`${socket.id} user just connected!`);

  socket.on("createTask", (data) => {
    const newTask = { id: randomID(), title: data.task}

    tasks["pending"].items.push(newTask)

    io.emit("tasks", tasks)
  })

  socket.on("taskDragged", (data) => {
    console.log(data);

    const { source, destination } = data

    const itemMoved = {
      ...tasks[source.droppableId].items[source.index]
    }

    console.log(itemMoved)

    tasks[source.droppableId].items.splice(source.index, 1)

    tasks[destination.droppableId].items.splice(destination.index, 0, itemMoved)

    io.emit('tasks', tasks)

    console.log("source", tasks[source.droppableId].items)
    console.log("destination", tasks[destination.droppableId].items)
    console.log(tasks)
  }); 

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("A user disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
