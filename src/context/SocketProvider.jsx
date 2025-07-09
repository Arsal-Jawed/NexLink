import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";
import CONFIG from '../Configuration';

const SocketContext = createContext(null);
const IP = CONFIG.IP || 'localhost';
const PORT = CONFIG.PORT || '8000';
const API = CONFIG.API_URL;


export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const socket = useMemo(() => io(`${API}`), []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
