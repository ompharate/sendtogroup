import { SocketContext } from '@/context/socketContext';
import React, { useContext } from 'react';

interface MainControllerProps {
    handleSend: () => void;
}

const MainController: React.FC<MainControllerProps> = ({ handleSend }) => {
    const { activeRoomId } = useContext(SocketContext) || { socket: null };;
    return (
        <div className='flex justify-center items-center'>
            <button
                disabled={activeRoomId ? false : true}
                style={{
                    backgroundColor:!activeRoomId ? "#f09090" : "#f87171",
                    cursor:activeRoomId ? "pointer" : "not-allowed"
                }}
                onClick={handleSend}
                className=' rounded-md text-white font-semibold px-2 py-4'
                aria-label='Transfer'
            >
                Transfer
            </button>
        </div>
    );
};

export default MainController;
