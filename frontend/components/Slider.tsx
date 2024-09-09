import React, { Dispatch, SetStateAction } from 'react'
import tabs from "../components/tabs";
const Slider = ({ setActiveTab }: { setActiveTab: Dispatch<SetStateAction<number>> }) => {
    return (
        <div>

            <div className='list-none  px-5 py-8 bg-white border   rounded-tr-xl rounded-br-xl flex flex-col gap-5'>
                {tabs.map((tab) => (
                    <li key={tab.id} onClick={() => { setActiveTab(tab.id) }} className='cursor-pointer'>
                        {tab.icon}
                    </li>
                ))}
            </div>
        </div>
    )
}
export default Slider