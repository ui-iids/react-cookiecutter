import { useAuth } from '@/auth'
import { Link } from '@tanstack/react-router'
import {
  Home,
  HomeIcon,
  LogIn,
  LogOut,
  Menu,
  Search,
  User,
  X
} from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserCard, setShowUserCard] = useState(false)
  const { keycloak } = useAuth()

  const roles =
    keycloak.tokenParsed?.realm_access?.roles.filter(
      (role) => !['default-roles-default','offline_access','uma_authorization'].includes(role),
    ) ?? []

  const handleLogin = () => {
    keycloak?.login()
  }

  const handleLogout = () => {
    keycloak?.logout()
  }

  const isAuthenticated = keycloak?.authenticated
  const userInfo = keycloak?.tokenParsed || {}

  return (
    <>
      <header className="p-4 flex items-center justify-between bg-white text-black shadow-lg">
        {/* Left side: menu + logo */}
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-gray-300 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <h1 className="ml-4 text-xl font-semibold">
            <Link to="/">
              <HomeIcon
                size={24} />
            </Link>
          </h1>

          <h1 className="ml-4 text-xl font-semibold">React Cookiecutter</h1>
        </div>

        {/* Right side: user auth controls */}
        <div className="relative">
          {!isAuthenticated ? (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <LogIn size={18} />
              Login
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowUserCard(!showUserCard)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                <User size={18} />
                {userInfo?.preferred_username || userInfo?.name || 'User'}
              </button>

              {showUserCard && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-xl shadow-lg p-4 z-50">
                  <p className="font-semibold">
                    {userInfo?.name || 'Unknown User'}
                  </p>
                  {userInfo?.email && (
                    <p className="text-sm text-gray-600">{userInfo.email}</p>
                  )}
                  <h3>Roles:</h3>
                  <ul>
                  {roles.map((role)=><li key={role}>{role}</li>)}
                  </ul>
                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Sidebar navigation */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-200 text-black shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {[
            { to: '/', label: 'Home', icon: <Home size={20} /> },
            { to: '/secure', label: 'Secure', icon: <Search size={20} /> },
          ].map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-300 transition-colors mb-2"
              activeProps={{
                className:
                  'flex items-center gap-3 p-3 rounded-lg bg-green-400 hover:bg-green-500 transition-colors mb-2',
              }}
            >
              {icon}
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
