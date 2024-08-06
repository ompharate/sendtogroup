import React from 'react';

interface MainControllerProps {
    handleSend: () => void;
}

const MainController: React.FC<MainControllerProps> = ({ handleSend }) => {
    return (
        <div className='flex justify-between items-center'>
            <button
                onClick={handleSend}
                className='bg-red-400 rounded-md text-white font-semibold px-2 py-4 cursor-pointer'
                aria-label='Transfer'
            >
                Transfer
            </button>
        </div>
    );
};

export default MainController;
