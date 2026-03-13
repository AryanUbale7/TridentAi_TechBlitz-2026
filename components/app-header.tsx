'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getCurrentUser, clearCurrentUser, getDoctors, getPatients } from '@/lib/storage'
import { User, Doctor, Patient } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LogOut, User as UserIcon, ChevronDown, Stethoscope } from 'lucide-react'

export function AppHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [allUsers, setAllUsers] = useState<(Doctor | Patient)[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setCurrentUser(user)
    }
    const doctors = getDoctors()
    const patients = getPatients()
    setAllUsers([...doctors, ...patients])
  }, [])

  // Hide header on login/signup pages
  if (pathname === '/login' || pathname === '/signup') {
    return null
  }

  if (!currentUser) {
    return null
  }

  const handleLogout = () => {
    clearCurrentUser()
    setShowDropdown(false)
    router.push('/login')
  }

  const handleSwitchUser = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId)
    if (user) {
      localStorage.setItem('clinic_current_user', JSON.stringify(user))
      setCurrentUser(user)
      setShowDropdown(false)
      // Redirect to appropriate dashboard
      if (user.role === 'doctor') {
        router.push('/doctor/dashboard')
      } else {
        router.push('/patient/dashboard')
      }
    }
  }

  const otherUsers = allUsers.filter((u) => u.id !== currentUser.id)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CHIKITSA DESK</h1>
              <p className="text-xs text-muted-foreground">Healthcare Management</p>
            </div>
          </div>

          {/* Right side - User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <Card className="absolute right-0 mt-2 w-64 border-0 shadow-lg">
                <CardContent className="p-0">
                  {/* Current User Info */}
                  <div className="p-3 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
                    <p className="text-xs text-muted-foreground">Logged in as</p>
                    <p className="font-semibold text-foreground">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
                  </div>

                  {/* Switch User Section */}
                  {otherUsers.length > 0 && (
                    <>
                      <div className="p-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">SWITCH ACCOUNT</p>
                        <div className="space-y-2">
                          {otherUsers.map((user) => (
                            <button
                              key={user.id}
                              onClick={() => handleSwitchUser(user.id)}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
                            >
                              <p className="text-sm font-medium text-foreground">{user.name}</p>
                              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-border"></div>
                    </>
                  )}

                  {/* Logout Button */}
                  <div className="p-3">
                    <Button
                      onClick={handleLogout}
                      variant="destructive"
                      className="w-full"
                      size="sm"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  )
}
