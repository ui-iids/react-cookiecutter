import { RouterProvider, createRouter } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import type Keycloak from 'keycloak-js'
import { StrictMode } from 'react'
import { AuthProvider, useAuth } from './auth.tsx'
import reportWebVitals from './reportWebVitals.ts'
import { RuntimeConfigProvider, useRuntimeConfig } from './runtimeConfig.tsx'
import './styles.css'

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
    auth: { keycloak: {} as any as Keycloak },
    runtimeConfig: {
      keycloakUrl: '',
      keycloakClientID: '',
      keycloakRealm: '',
      gatewayUrl: '',
    },
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()
  const runtimeConfig = useRuntimeConfig()
  return (
    <RouterProvider
      router={router}
      context={{ auth, runtimeConfig, ...TanStackQueryProviderContext }}
    />
  )
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <RuntimeConfigProvider>
          <AuthProvider>
            <InnerApp />
          </AuthProvider>
        </RuntimeConfigProvider>
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
