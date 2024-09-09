"use client";
import { SocketContext } from '@/context/socketContext';
import React, {  KeyboardEvent, useContext, useEffect, useState } from 'react';


const MessageSection = () => {
    const { socket, activeRoomId } = useContext(SocketContext) || { socket: null };
    const [allMessages, setAllMessages] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    console.log(allMessages)

    useEffect(() => {

        if (socket) {
            socket.on("message", (message) => {
                setAllMessages(prevMessages => [...prevMessages, message]);
            });


        }
        return () => {
            socket?.off('message');
        }
    }, [socket])

    async function sendMessage(e:KeyboardEvent<HTMLInputElement>) {
        if (socket && e.key === "Enter") {
            socket.emit('newMessage', { activeRoomId, message });
            setMessage('');
        }
    }

    return (
        <div className='mx-5 my-5 h-[300px] border rounded-md'>
            <div className='list-none h-full overflow-scroll'>
                {allMessages.map((message) => (
                    <li className='px-2 py-2'>{message}</li>
                ))}
               
            </div>
            <input
                onKeyDown={(e) => sendMessage(e)}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className='w-full my-1 bg-slate-50 rounded-md  p-5 border'
                placeholder='Type your message here...'
            />
        </div>
    );
}

export default MessageSection;