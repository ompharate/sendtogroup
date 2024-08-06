"use client";

import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/socketContext";
import UserSideControl from "@/components/UserSideControl";
import ReceiverControl from "@/components/ReciverControl";
import MainController from "@/components/MainControler";

export default function Home() {
  const { socket, activeRoomId } = useContext(SocketContext) || { socket: null };
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {

    if (socket) {
      socket.on("newUser", (message) => {
        console.log(message)
      })
    }

    return () => {
      socket?.off("newUser")
    }

  }, [socket])

  const handleSend = () => {
    if (socket) {

      if (message != null) {
        socket.emit("newMessage", { activeRoomId, message })
      }
    }
  }

  return (
    <div className="flex h-[80%]">
      <UserSideControl setMessage={setMessage} />
      <MainController handleSend={handleSend} />
      <ReceiverControl />
    </div>
  );
}
