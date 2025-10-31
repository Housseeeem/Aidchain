"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  email: string
  username: string
  avatar_img: string
}

interface AuthContextType {
  user: User | null
  jwt: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (userData: User, token: string) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [jwt, setJwt] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load user and JWT from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("aidchain_user")
    const storedJwt = localStorage.getItem("aidchain_jwt")
    
    if (storedUser && storedJwt) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setJwt(storedJwt)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("aidchain_user")
        localStorage.removeItem("aidchain_jwt")
      }
    }
    
    setIsLoading(false)
  }, [])

  const login = (userData: User, token: string) => {
    setUser(userData)
    setJwt(token)
    setIsAuthenticated(true)
    localStorage.setItem("aidchain_user", JSON.stringify(userData))
    localStorage.setItem("aidchain_jwt", token)
  }

  const logout = () => {
    setUser(null)
    setJwt(null)
    setIsAuthenticated(false)
    localStorage.removeItem("aidchain_user")
    localStorage.removeItem("aidchain_jwt")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("aidchain_user", JSON.stringify(updatedUser))
    }
  }

  const value = {
    user,
    jwt,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}