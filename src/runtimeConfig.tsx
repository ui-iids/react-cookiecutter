import { createContext, useContext, useEffect, useState } from "react"
export interface RuntimeConfig {
    keycloakClientID: string,
    keycloakUrl: string,
    keycloakRealm: string,
    gatewayUrl: string,
}
export const RuntimeConfigContext = createContext<RuntimeConfig | undefined>(undefined)

export const RuntimeConfigProvider = ({ children }: Readonly<{ children: React.ReactNode }>)=>{
  const [runtimeConfig, setRuntimeConfig] = useState<RuntimeConfig | undefined>(undefined)
    useEffect(()=>{
        fetch("/runtimeConfig.json").then(resp=>resp.json()).then(data=>setRuntimeConfig(data))
    },[])
    
    if(typeof runtimeConfig === "undefined"){
        return <div>Loading...</div>
    }

    return <RuntimeConfigContext.Provider value={runtimeConfig}>
        {children}
    </RuntimeConfigContext.Provider>
}
export function useRuntimeConfig() {
  const context = useContext(RuntimeConfigContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}