"use client"
import { SocketContext } from '@/context/socketContext'
import React, { useContext, useState } from 'react'

const Navbar = () => {

    const { socket, randomId, setActiveRoomId } = useContext(SocketContext) || { socket: null };
    const [roomIdToJoin, setRoomIdToJoin] = useState<string | null>(null);
    const handleJoinRoom = () => {
        if (socket) {
            setActiveRoomId(roomIdToJoin+"")
            if (roomIdToJoin != null) {
                socket.emit("join", roomIdToJoin)
            }
        }
    }

    return (
        <div className='flex w-full bg-[#19191c] items-center justify-between'>
            <div>
                <h1 className='text-2xl text-white font-bold px-2 py-5  cursor-pointer'>
                    SendToGroup.com
                </h1>
            </div>
            <div>
                <h1 className='text-3xl tracking-wider text-red-500 font-semibold cursor-pointer'>{randomId}</h1>
            </div>

            <div className='flex gap-2'>
                <input
                    className='px-2  rounded-lg'
                    onChange={(e) => setRoomIdToJoin(e.target.value)}
                    type="text"
                    placeholder="Enter the id"
                />
                <button onClick={handleJoinRoom} className='px-3 py-4 bg-[#281a21] text-white border border-white rounded-xl cursor-pointer font-semibold hover:bg-[#121211] hover:scale-90'>Join Room</button>
            </div>

        </div>
    )
}

export default Navbar