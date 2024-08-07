"use client";

import { generateRandomSixDigitNumber } from "@/utils/randomGenerator";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextValue {
  socket: Socket | null;
  randomId: number
  activeRoomId:string|null,
  setActiveRoomId:React.Dispatch<React.SetStateAction<string|null>>

}

export const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [randomId, setRandomId] = useState<number>(0);
  const [activeRoomId, setActiveRoomId] = useState<string|null>(null);
  useEffect(() => {
    setRandomId(generateRandomSixDigitNumber());
    const socketInstance = io("http://localhost:4000");
    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });

    setSocket(socketInstance);

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketInstance.on("message", (message) => {
      console.log("Message received:", message);
    });


    return () => {
      socketInstance.disconnect();
    };
  }, []);



  return (
    <SocketContext.Provider value={{ socket, randomId,activeRoomId ,setActiveRoomId}}>
      {children}
    </SocketContext.Provider>
  );
};
