"use client"
import { SocketContext } from '@/context/socketContext';
import React, { useContext, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
const CodeEditorSection = () => {
    const { socket, activeRoomId } = useContext(SocketContext) || { socket: null };
    const [code, setCode] = React.useState(
        `function sayHello() {\n  console.log('Hello world');\n}`
    );

    useEffect(() => {
        if (socket) {
            socket.on("updateCode", (newCode) => {
                setCode(newCode)
            });
        }
        return () => {
            socket?.off("codeChange");
        }
    }, [socket]);

    async function updateCode(newCode: string) {
        socket?.emit("codeChange", { newCode, activeRoomId });
        setCode(newCode);
    }

    return (
        <>
            <Editor
                value={code}
                onValueChange={code => updateCode(code)}
                highlight={code => highlight(code, languages.js)}
                padding={10}

                style={{
                    backgroundColor: '#282c34',
                    color: '#abb2bf',
                    borderRadius: 5,
                    border: '1px solid #282c34',
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12,
                }}
            />
        </>
    );
};

export default CodeEditorSection;
