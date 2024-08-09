"use client";

import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/socketContext";
import UserSideControl from "@/components/UserSideControl";
import ReceiverControl from "@/components/ReciverControl";
import MainController from "@/components/MainControler";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const { socket, activeRoomId } = useContext(SocketContext) || { socket: null };
  const [message, setMessage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast()
  // console.log(process.env.BACKEND_URL)
  useEffect(() => {

    if (socket) {
      socket.on("newUser", (message) => {
        toast({
          title: message,
        })
      })
      socket.on("file-received", (path) => {
        const link = document.createElement('a');
        link.target = "_blank";
        link.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/` + path;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
    }

    return () => {
      socket?.off("newUser")
      socket?.off("file-received")
    }

  }, [socket])

  const handleSend = async () => {
    if (socket) {

      if (message != null) {
        socket.emit("newMessage", { activeRoomId, message })
        toast({
          title: "Message has been sent",
        })
      }
      console.log(file)
      if (file && file.size <= 15000000) {
        const formData = new FormData();
        formData.append('file', file);

        try {

          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();
          if (result?.uploaded && socket) {
            socket.emit("upload-file",
              { fileName: result.file, activeRoomId }
            )
            toast({
              title: "File has been sent",
            })
            setFile(null)
          }

        } catch (error) {
          console.error('Error uploading file:', error);

        }
      }

    }
  }



  return (
    <div className="flex flex-col h-[80%] lg:flex-row">
      <UserSideControl setMessage={setMessage} setFile={setFile} />
      <MainController handleSend={handleSend} />
      <ReceiverControl />
    </div>
  );
}
