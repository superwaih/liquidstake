"use client"

import React, { createContext, PropsWithChildren, useContext, useState } from 'react'

const AppContext = createContext()

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