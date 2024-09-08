import React from 'react'

const FileSection = () => {
    return (

        <div className='mx-5 my-5  rounded-md'>
            <label htmlFor="uploadFile1"
                className="bg-white w-full text-gray-500 font-semibold text-base rounded  h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed font-[sans-serif]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-11 mb-2 fill-gray-500" viewBox="0 0 32 32">
                    <path
                        d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                        data-original="#000000" />
                    <path
                        d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                        data-original="#000000" />
                </svg>
                Upload file

                <input type="file" id='uploadFile1' className="hidden" />
                {/* <input type="file" onChange={handleFileChange} id='uploadFile1' className="hidden" /> */}
                <p className="text-xs font-medium text-gray-400 mt-2">PDF, WORD, PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
            </label>
              
            <div className='flex gap-5 my-2'>
                <div className="border p-5 text-center">
                    <div
                        className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-black mx-auto"
                    ></div>
                    <h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Your adventure is about to begin
                    </p>
                </div>
                <div className="border p-5 text-center">
                    <div
                        className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-black mx-auto"
                    ></div>
                    <h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Your adventure is about to begin
                    </p>
                </div>
            </div>

        </div>
    )
}

export default FileSection