import React, { Dispatch, SetStateAction } from 'react'
const UserSideControl = ({ setMessage }: { setMessage: Dispatch<SetStateAction<string | null>> }) => {
    return (
        <div className='flex-1 mx-10 my-10'>
            <textarea onChange={(e) => setMessage(e.target.value)} className='h-full w-full outline-none rounded-lg bg-slate-200 resize-none px-2' ></textarea>
        </div>
    )
}

export default UserSideControl