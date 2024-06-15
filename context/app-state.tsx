"use client"

import React, { createContext, PropsWithChildren, useContext, useState } from 'react'

interface IAppContext {
  currentMode: string;
  setCurrentMode: React.Dispatch<React.SetStateAction<string>>
}
const AppContext = createContext({} as IAppContext)

export const useAppContext = () => useContext(AppContext)

const AppProvider = ({children}: PropsWithChildren) => {
    const [currentMode, setCurrentMode] = useState('staking')
  return (
    <AppContext.Provider
    value={{
        currentMode,
        setCurrentMode
    }}
    >
        {children}
    </AppContext.Provider>
  )
}

export default AppProvider