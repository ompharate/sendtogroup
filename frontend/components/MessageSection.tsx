"use client";
import { SocketContext } from '@/context/socketContext';
import React, { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';

// interface UserSideControlProps {
//     setMessage: Dispatch<SetStateAction<string | null>>;
//     setFile: Dispatch<SetStateAction<File | null>>;
// }

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

    async function sendMessage(e) {
        if (socket && e.key === "Enter") {
            socket.emit('newMessage', { activeRoomId, message });
            setMessage('');
        }
    }

    // const { toast } = useToast()
    // const [uploadStatus, setUploadStatus] = useState<string | null>(null);

    // const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files) {
    //         if (e.target?.files[0].size < 1000000) {
    //             console.log(e.target.files[0])
    //             setFile(e.target.files[0]);
    //         } else {
    //             toast({
    //                 title: "File size must be less than 1MB",
    //             })
    //         }
    //     }
    // };

    return (
        <div className='mx-5 my-5 h-[300px] border rounded-md'>
            <div className='list-none h-full overflow-scroll'>
                {allMessages.map((message) => (
                    <li className='px-2 py-2'>{message}</li>
                ))}
                {/* <li className='px-2 float-right'>bye</li> */}
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
