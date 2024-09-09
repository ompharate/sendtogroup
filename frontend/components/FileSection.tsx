"use client"
import { SocketContext } from '@/context/socketContext';
import Image from 'next/image';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { toast } from './ui/use-toast';
interface ProgressFile {
    fileName: string;
    percentComplete: number;
}

const FileSection = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileProgressHandler, setFileProgressHandler] = useState<ProgressFile[]>([]);
    const [loading, setLoading] = useState(false);
    const { socket, activeRoomId } = useContext(SocketContext) || { socket: null, activeRoomId: '' };

    useEffect(() => {
        if (socket) {
            const handleProgress = ({ percentComplete, fileName }: { percentComplete: number; fileName: string }) => {
                setFileProgressHandler(prev => {
                    const index = prev.findIndex(item => item.fileName === fileName);
                    if (index !== -1) {

                        const updatedFiles = [...prev];
                        updatedFiles[index] = { ...updatedFiles[index], percentComplete };
                        return updatedFiles;
                    } else {
                        return [...prev, { fileName, percentComplete }];
                    }
                });
            };

            socket.on("progress", handleProgress);
            return () => {
                socket.off("progress", handleProgress);
            };
        }
    }, [socket]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            toast({
                title: "Please select a file",
            })
            return;
        }

        if (!socket?.connected || socket == undefined || !activeRoomId) {
            toast({
                title: "Please connect to a room",
            })
            return;
        }

        if ((file.size / 1024) > (5000000 / 1024)) {
            toast({
                title: "File size exceeds 5MB",
            })
            return;
        }

        try {

            const response = await fetch(`http://localhost:4000/generatePresignedUrl?filename=${encodeURIComponent(file.name)}&filetype=${encodeURIComponent(file.type)}`);
            const { url } = await response.json();

            const xhr = new XMLHttpRequest();
            xhr.open('PUT', url, true);
            xhr.setRequestHeader('Content-Type', file.type);
            setLoading(true);
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    socket?.emit("progress", { percentComplete, activeRoomId, fileName: file.name });
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    toast({
                        title: "file uploaded successfully",
                    })
                    setLoading(false);
                    setFile(null)
                } else {
                    alert(`Upload failed with status ${xhr.status}`);
                }
            };


            xhr.onerror = () => {
                setLoading(false);
                setFile(null)
                alert('An error occurred while uploading the file.');
            };

            xhr.send(file);
        } catch (error) {
            console.error('Error uploading file:', error);
            toast({
                title: "Failed to upload file",
            })
        }
    };


    async function handleDownloadFile(fileName: string) {
        window.open(process.env.NEXT_PUBLIC_AWS_BUCKET_URL + "/" + fileName, "_self")
    }

    return (
        <div className='mx-5 my-5 rounded-md'>
            <label htmlFor="uploadFile1"
                className="bg-white w-full text-gray-500 font-semibold text-base rounded h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed font-[sans-serif]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-11 mb-2 fill-gray-500" viewBox="0 0 32 32">
                    <path d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z" />
                    <path d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z" />
                </svg>
                Upload file

                <input type="file" id='uploadFile1' onChange={handleFileChange} className="hidden" />
                <button style={{
                    opacity: loading ? "0.5" : "1",
                }} className='bg-blue-600 p-2 rounded-md text-white' onClick={handleUpload} disabled={loading}>{loading ? "Uploading.." : "Submit"} </button>
                <p className="text-xs font-medium text-gray-400 mt-2">PDF, WORD, PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
            </label>

            <div className='flex gap-5 my-2'>
                {fileProgressHandler.length > 0 ? (
                    fileProgressHandler.map((fileProgress) => (
                        <div style={{
                            opacity: fileProgress.percentComplete >= 100 ? "1" : "0.5",
                        }} key={fileProgress.fileName} className="border p-5 text-center">
                            {fileProgress.percentComplete >= 100 ? (
                                <div className='w-full flex  justify-center'>
                                    <Image src={"/file.jfif"} width={50} height={50} alt='file' />
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-black mx-auto"></div>
                                    <h2 className="text-zinc-900 dark:text-white mt-4">uploading...</h2>
                                </>
                            )}
                            <h2 className="text-zinc-900 dark:text-white mt-4">{fileProgress.fileName}</h2>
                            {fileProgress.percentComplete < 100 ? (
                                <p className="text-zinc-600 dark:text-zinc-400">Progress: {fileProgress.percentComplete}%</p>

                            ) : null}
                            <button onClick={() => handleDownloadFile(fileProgress.fileName)} className='bg-green-400 p-2 text-white font-semibold rounded-md' disabled={fileProgress.percentComplete < 100}>Download</button>
                        </div>
                    ))
                ) : null}
            </div>
        </div >
    );
}
export default FileSection;     