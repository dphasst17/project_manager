// hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
const SOCKET_URL = `${process.env.NEXT_PUBLIC_URL_SERVER}`;

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  
  useEffect(() => {
    const socket = io(SOCKET_URL.split("/api")[0],{
      transports: ['websocket'],
      autoConnect: true

    });
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
};

