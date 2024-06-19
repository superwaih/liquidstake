"use client"

import React, { createContext, PropsWithChildren, useContext, useState } from 'react'

interface IAppContext {
  currentMode: string;
  setCurrentMode: React.Dispatch<React.SetStateAction<string>>;
  messageInfo: {
    messageText: string | null;
    messageType: string | null; // default to 'success', 'error', 'loading'
    isLoading: boolean;
    boxType: string;
  };
  setMessageInfo: React.Dispatch<React.SetStateAction<{
    messageText: string | null;
    messageType: string | null;
    isLoading: boolean;
    boxType: string;
  }>>;
}

const AppContext = createContext({} as IAppContext)

export const useAppContext = () => useContext(AppContext)

const AppProvider = ({children}: PropsWithChildren) => {
  const [currentMode, setCurrentMode] = useState('staking')
  const [messageInfo, setMessageInfo] = useState({
    messageText: null,
    messageType: null, // default to 'success', 'error', 'loading'
    isLoading: false,
    boxType: 'transaction'
  });

  return (
    <AppContext.Provider
      value={{
        currentMode,
        setCurrentMode,
        messageInfo,
        setMessageInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
