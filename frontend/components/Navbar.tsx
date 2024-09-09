"use client"
import { SocketContext } from '@/context/socketContext'
import React, { useContext, useState } from 'react'
import { toast } from './ui/use-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Navbar = () => {

    const { socket, randomId, setActiveRoomId, activeRoomId, setRandomId } = useContext(SocketContext) || { socket: null };
    console.log(activeRoomId)
    const [roomIdToJoin, setRoomIdToJoin] = useState<string | null>(null);
    const navigate = useRouter();

    const handleJoinRoom = () => {
        if (socket) {
            if (roomIdToJoin != null) {
                if (roomIdToJoin.length < 6) {
                    toast({
                        title: "Id must be 6 characters long",
                    })
                    return;
                }
                setRandomId(parseInt(roomIdToJoin))
                setActiveRoomId(roomIdToJoin + "")
                socket.emit("join", roomIdToJoin)
                setRoomIdToJoin("")
                toast({
                    title: "You have joined this room",
                })
            } else {

                toast({
                    title: "Id must be common to join, enter one of the common or provided id into all device",
                })
            }
        }
    }

    const handleLeaveRoom = () => {
        if (socket) {
            socket.emit("leave", activeRoomId)
            setActiveRoomId(null)
            toast({
                title: "You have left the room",
            })
            window.location.reload()
        }
    }

    return (
        <div className='flex flex-col w-full border-b-2 items-center justify-between lg:flex-row'>
            <div>
                <h1 className='  font-bold px-2 py-5  cursor-pointer lg:text-2xl'>
                    <Image src={"/logo.png"} width={140} height={100} alt='logo' />
                </h1>
            </div>
            <div className=''>
                <h1 className='tracking-wider text-red-500 font-semibold cursor-pointer lg:text-3xl '>{randomId ? randomId : null}</h1>
            </div>
            {!activeRoomId ? (
                <div className='flex gap-2 items-center flex-col lg:flex-row'>
                    <input
                        className='px-2 border  rounded-lg h-7 lg:h-14'
                        onChange={(e) => setRoomIdToJoin(e.target.value)}
                        value={roomIdToJoin ? roomIdToJoin : ""}
                        type="text"
                        pattern='[0-9]$'
                        placeholder="Enter the id"
                        required={true}
                    />

                    <button onClick={handleJoinRoom} className='px-3 py-4 bg-[#281a21] text-white border border-white rounded-xl cursor-pointer font-semibold hover:bg-[#121211] hover:scale-90'>Join Room</button>
                </div>
            ) : (
                <button onClick={handleLeaveRoom} className='px-3 py-4  text-white border border-white rounded-xl cursor-pointer font-semibold bg-red-400 hover:scale-90'>Leave Room</button>

            )}
        </div>
    )
}

export default Navbar