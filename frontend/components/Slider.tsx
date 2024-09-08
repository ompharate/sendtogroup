import Image from 'next/image'
import React, { Dispatch, SetStateAction } from 'react'
import FileSection from './FileSection'
import MessageSection from './MessageSection'
import CodeEditorSection from './CodeEditorSection'

const tabs = [{
    id:0,
    icon: <Image alt='text' src={"/textcon.png"} width={35} height={35} />,
    component: <MessageSection />
}, {
    id:1,
    icon: <Image alt='text' src={"/filetransfer.png"} width={35} height={35} />,
    component: <FileSection />
}, {
    id:2,
    icon: <Image alt='text' src={"/codecoll.jfif"} width={35} height={35} />,
    component: <CodeEditorSection/>
}]

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