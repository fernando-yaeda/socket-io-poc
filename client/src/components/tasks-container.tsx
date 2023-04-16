"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import * as io from "socket.io-client";

interface Props {
  socket: io.Socket;
}

export default function TasksContainer({socket}: Props) {
  const [tasks, setTasks] = useState({});

  useEffect(() => {
    function fetchTasks() {
      fetch("http://localhost:5000/tasks")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setTasks(data);
        });
    }
    fetchTasks();
  }, []);

  useEffect(()=> {
    socket.on("tasks", (data) => setTasks(data))
  }, [socket])

  const handleDragEnd = ({ destination, source }: any) => {
    console.log("dragging")
    if (!destination) return;
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;

    socket.emit("taskDragged", {
      source,
      destination,
    });
  };

  return (
    <div className="h-96 w-screen flex items-center justify-center space-x-5">
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.entries(tasks).map((task: any): any => (
          <div key={task[1].title} className="w-1/3 h-full flex flex-col">
            <h3 className="text-center">{task[1].title} tasks</h3>

            <div className="w-full h-full flex flex-col border-slate-900 border rounded-md p-2">
              <Droppable droppableId={task[1].title}>
                {(provided) => (
                  <div className="h-full flex flex-col gap-2" ref={provided.innerRef} {...provided.droppableProps}>
                    {task[1].items.map((item: any, index: any) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            key={item.id}
                            className="w-full boder p-4 bg-orange-400 rounded-md cursor-grab"
                          >
                            <p>{item.title}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}
