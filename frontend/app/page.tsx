"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/socketContext";
import UserSideControl from "@/components/MessageSection";
import { useToast } from "@/components/ui/use-toast";
import Slider from "@/components/Slider";
import FileTransfer from "@/components/FileSection";
import Image from "next/image";
import CodeEditorSection from "@/components/CodeEditorSection";
import { Users } from "lucide-react";

const tabs = [{
  icon: <Image alt='text' src={"/textcon.png"} width={35} height={35} />,
  component: <UserSideControl />
}, {
  icon: <Image alt='text' src={"/filetransfer.png"} width={35} height={35} />,
  component: <FileTransfer />
}, {
  icon: <Image alt='text' src={"/codecoll.jfif"} width={35} height={35} />,
  component: <CodeEditorSection />
}]


export default function Home() {
  const { socket, activeRoomId } = useContext(SocketContext) || { socket: null };
  const [numberOfUsers, setNumberOfUsers] = useState<string[] | null>([]);
  // const [message, setMessage] = useState<string | null>(null)
  // const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState(0);
  // console.log(process.env.BACKEND_URL)
  useEffect(() => {

    if (socket) {
      socket.on("newUser", (nameToJoin,numberOfUsers) => {
        setNumberOfUsers(nameToJoin)
        toast({
          title: "New User is joined",
        })
      })
    }
    //     socket.on("file-received", (path) => {
    //       const link = document.createElement('a');
    //       link.target = "_blank";
    //       link.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/` + path;
    //       document.body.appendChild(link);
    //       link.click();
    //       document.body.removeChild(link);
    //     })
    //   }

    return () => {
      socket?.off("newUser")
      // socket?.off("file-received")
    }
  }, [socket])

  // const handleSend = async () => {
  //   if (socket) {

  //     if (message != null) {
  //       socket.emit("newMessage", { activeRoomId, message })
  //       toast({
  //         title: "Message has been sent",
  //       })
  //     }
  //     console.log(file)
  //     if (file && file.size <= 15000000) {
  //       const formData = new FormData();
  //       formData.append('file', file);

  //       try {

  //         const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
  //           method: 'POST',
  //           body: formData,
  //         });
  //         const result = await response.json();
  //         if (result?.uploaded && socket) {
  //           socket.emit("upload-file",
  //             { fileName: result.file, activeRoomId }
  //           )
  //           toast({
  //             title: "File has been sent",
  //           })
  //           setFile(null)
  //         }

  //       } catch (error) {
  //         console.error('Error uploading file:', error);

  //       }
  //     }

  //   }
  // }

  return (
    <div className="px-5 py-5">
      <div className="border rounded-xl p-3 list-none flex gap-5">
        {Array.from({ length: numberOfUsers?.length ?? 0 }).map((_, num) => (
          <li className="flex flex-col items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p>om</p>
          </li>
        ))}
      </div>
      <div className="my-5 flex items-center gap-5 h-full">
        <Slider setActiveTab={setActiveTab} />
        <div className="my-5 w-full">
          {tabs[activeTab].component}
        </div>
      </div>
    </div>
  );
}