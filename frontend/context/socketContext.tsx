"use client";

import { generateRandomSixDigitNumber } from "@/utils/randomGenerator";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextValue {
  socket: Socket | null;
  randomId: number
  activeRoomId: string | null,
  setActiveRoomId: React.Dispatch<React.SetStateAction<string | null>>,
  setRandomId: React.Dispatch<React.SetStateAction<number>>

}

export const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [randomId, setRandomId] = useState<number>(0);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  useEffect(() => {
   
    setRandomId(generateRandomSixDigitNumber());
    const socketInstance = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);
    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });

    setSocket(socketInstance);

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
    });

  

    return () => {
      socketInstance.disconnect();
    };
  }, []);



  return (
    <SocketContext.Provider value={{ socket, randomId, activeRoomId, setActiveRoomId ,setRandomId}}>
      {children}
    </SocketContext.Provider>
  );
};
