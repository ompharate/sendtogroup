"use client"
import { SocketContext } from '@/context/socketContext'
import React, { useContext, useEffect, useState } from 'react'
const ReceiverControl = () => {
    const [receivedMessage, setReceivedMessage] = useState<string | null>(null)
    const { socket } = useContext(SocketContext) || { socket: null };
    useEffect(() => {

        if (socket) {
            socket.on("message", (msg) => {
                setReceivedMessage(msg)
            });
        }

        return () => {
            socket?.off("message")
        }

    }, [socket]);

    return (
        <div className=' flex-1 mx-10 my-10'>
            <textarea disabled={true} value={receivedMessage ? receivedMessage : ""} className='h-full w-full outline-none rounded-lg bg-slate-200 resize-none px-2' ></textarea>
        </div>
    )
}
export default ReceiverControl;