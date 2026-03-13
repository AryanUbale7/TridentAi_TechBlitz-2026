'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { findUserByEmail, setCurrentUser, initializeStorage } from '@/lib/storage'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      initializeStorage()
      
      // Simple authentication - find user by email
      // In production, you'd hash and verify the password
      const user = findUserByEmail(email)
      
      if (!user) {
        setError('User not found. Please check your email or sign up.')
        setLoading(false)
        return
      }

      // For demo purposes, accept any password for existing users
      setCurrentUser(user)
      
      // Redirect based on user role
      if (user.role === 'doctor') {
        router.push('/doctor/dashboard')
      } else {
        router.push('/patient/dashboard')
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CD</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-center">CHIKITSA DESK</CardTitle>
            <CardDescription className="text-center">Healthcare Management Platform - Welcome back!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Field>
              </FieldGroup>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <Link href="/signup" className="block">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                >
                  Sign Up
                </Button>
              </Link>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2 font-semibold">Demo Accounts:</p>
                <div className="space-y-2 text-xs text-gray-600">
                  <div>
                    <p className="font-medium">Doctor:</p>
                    <p>Email: dr.smith@smartclinic.com</p>
                  </div>
                  <div>
                    <p className="font-medium">Patient:</p>
                    <p>Email: john.doe@email.com</p>
                  </div>
                  <p className="text-gray-500 mt-2">Password: Any value (demo mode)</p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
