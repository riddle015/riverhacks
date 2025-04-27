// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react'
import { signup, login } from '@/api'

interface AuthContextType {
  token: string | null
  userId: string | null
  signup: (data: any) => Promise<void>
  login: (data: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>(null!)

export const AuthProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem('userId')
  )

  const handleLogin = async (data: { email: string; password: string }) => {
    const res = await login(data)
    setToken(res.access_token)
    setUserId(res.user_id)
    localStorage.setItem('token', res.access_token)
    localStorage.setItem('userId', res.user_id)
  }

  const handleSignup = async (data: any) => {
    const res = await signup(data)
    setToken(res.access_token)
    setUserId(res.user.user_id)
    localStorage.setItem('token', res.access_token)
    localStorage.setItem('userId', res.user.user_id)
  }

  const logout = () => {
    setToken(null)
    setUserId(null)
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        signup: handleSignup,
        login: handleLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
