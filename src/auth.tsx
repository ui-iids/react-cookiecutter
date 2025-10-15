import { redirect } from '@tanstack/react-router'
import Keycloak from 'keycloak-js'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRuntimeConfig } from './runtimeConfig'

export interface AuthState {
  keycloak: Keycloak
}

export const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  console.log('Running auth provider...')
  const runtimeConfig = useRuntimeConfig()
  const [initialized, setInitialized] = useState(false)
  const [keycloak, setKeycloak] = useState<Keycloak | undefined>(undefined)

  useEffect(() => {
    const keycloak = new Keycloak({
      clientId: runtimeConfig.keycloakClientID,
      realm: runtimeConfig.keycloakRealm,
      url: runtimeConfig.keycloakUrl,
    })
    const token = localStorage.getItem('kc_token') || undefined
    const refreshToken = localStorage.getItem('kc_refreshToken') || undefined
    keycloak
      .init({
        pkceMethod: 'S256',
        checkLoginIframe: false,
        token,
        refreshToken,
      })
      .then((authenticated) => {
        if (authenticated) {
          localStorage.setItem('kc_token', keycloak.token ?? '')
          localStorage.setItem('kc_refreshToken', keycloak.refreshToken ?? '')
        } else {
          localStorage.removeItem('kc_token')
          localStorage.removeItem('kc_refreshToken')
        }
        setInitialized(true)
      })
      .catch((err) => {
        console.error('Keycloak Init Failed:', err)
        localStorage.removeItem('kc_token')
        localStorage.removeItem('kc_refreshToken')
      })
    setKeycloak(keycloak)
  }, [])

  if (!initialized) {
    return <div>Loading...</div>
  }
  console.log('Auth provider initialized...')

  return (
    <AuthContext.Provider value={keycloak?{ keycloak }:undefined}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function requireAuth() {
  const { keycloak } = useAuth()

  if (!keycloak.didInitialize) {
    throw new Promise(() => {}) // Wait until Keycloak is initialized
  }

  if (!keycloak.authenticated) {
    keycloak.login({ redirectUri: window.location.href })
    throw redirect({ to: '/' }) // optional fallback while redirecting
  }

  return true
}
