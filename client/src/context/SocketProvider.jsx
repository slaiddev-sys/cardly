import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../socket';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [room, setRoom] = useState(localStorage.getItem('room') || null);
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (room) {
            socket.emit('join_room', room);
        }
    }, [room]);

    useEffect(() => {
        socket.on('receive_drawing', (data) => {
            console.log('Received drawing:', data);
            setMessages((prev) => [
                {
                    id: Date.now(),
                    sender: data.sender,
                    date: new Date().toLocaleDateString(),
                    image: data.image
                },
                ...prev
            ]);
        });

        return () => {
            socket.off('receive_drawing');
        };
    }, []);

    const joinRoom = (roomCode, name) => {
        setRoom(roomCode);
        setUsername(name);
        localStorage.setItem('room', roomCode);
        localStorage.setItem('username', name);
        socket.emit('join_room', roomCode);
    };

    const sendDrawing = (image) => {
        if (room) {
            const data = { room, sender: username, image };
            socket.emit('send_drawing', data);

            // Add to own messages immediately
            setMessages((prev) => [
                {
                    id: Date.now(),
                    sender: 'You',
                    date: new Date().toLocaleDateString(),
                    image: image
                },
                ...prev
            ]);
        } else {
            console.error("Cannot send drawing: No room joined.");
            alert("Error: You are not connected to a room. Please join a room first.");
        }
    };

    return (
        <SocketContext.Provider value={{ room, username, messages, joinRoom, sendDrawing }}>
            {children}
        </SocketContext.Provider>
    );
};
