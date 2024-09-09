"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/socketContext";
import { useToast } from "@/components/ui/use-toast";
import Slider from "@/components/Slider";
import tabs from "../components/tabs";


export default function Home() {
  const { socket } = useContext(SocketContext) || { socket: null };
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {

    if (socket) {
      socket.on("newUser", (numberOfUsers) => {
        setNumberOfUsers(numberOfUsers)
        toast({
          title: "New User is joined Or left the room",
        })
      })
    }
  
    return () => {
      socket?.off("newUser")
    }
  }, [socket])


  return (
    <div className="px-5 py-5">
      <div className="border rounded-xl p-3 list-none flex gap-5">
        {Array.from({ length: numberOfUsers ?? 0 }).map((_, num) => (
          <li key={num} className="flex flex-col items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p>Ano..{num}</p>
          </li>
        ))}
      </div>
      <div className="my-5 flex items-center gap-5 h-full">
        <Slider setActiveTab={setActiveTab} />
        <div className="my-5 w-full">
          {tabs.map((tab) => (
            <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
              {tab.component}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}