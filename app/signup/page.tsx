'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import Link from 'next/link'
import { registerUser, setCurrentUser, initializeStorage, findUserByEmail } from '@/lib/storage'
import { Doctor, Patient } from '@/lib/types'

export default function SignupPage() {
  const router = useRouter()
  const [role, setRole] = useState<'doctor' | 'patient'>('patient')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialization: '',
    dateOfBirth: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      initializeStorage()

      // Validation
      if (!formData.name || !formData.email || !formData.phone) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      // Check if user already exists
      const existingUser = findUserByEmail(formData.email)
      if (existingUser) {
        setError('Email already registered')
        setLoading(false)
        return
      }

      // Create new user
      const userId = `${role}-${Date.now()}`
      let newUser: Doctor | Patient

      if (role === 'doctor') {
        newUser = {
          id: userId,
          email: formData.email,
          name: formData.name,
          role: 'doctor',
          specialization: formData.specialization || 'General Medicine',
          licenseNumber: `LIC-${Date.now()}`,
          phone: formData.phone,
          bio: 'New doctor profile',
          clinicId: 'clinic-001',
          rating: 5.0,
          reviewCount: 0,
          experience: 0,
          createdAt: new Date().toISOString(),
          availableHours: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
          ],
        } as Doctor
      } else {
        newUser = {
          id: userId,
          email: formData.email,
          name: formData.name,
          role: 'patient',
          dateOfBirth: formData.dateOfBirth || '1990-01-01',
          phone: formData.phone,
          address: 'Address not set',
          createdAt: new Date().toISOString(),
        } as Patient
      }

      registerUser(newUser)
      setCurrentUser(newUser)

      // Redirect based on role
      if (role === 'doctor') {
        router.push('/doctor/dashboard')
      } else {
        router.push('/patient/dashboard')
      }
    } catch (err) {
      setError('An error occurred during signup. Please try again.')
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
            <CardTitle className="text-center text-2xl">CHIKITSA DESK</CardTitle>
            <CardDescription className="text-center">
              Create your account and join our healthcare platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Account Type</FieldLabel>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'doctor' | 'patient')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Phone</FieldLabel>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Field>
              </FieldGroup>

              {role === 'doctor' && (
                <FieldGroup>
                  <Field>
                    <FieldLabel>Specialization</FieldLabel>
                    <Input
                      type="text"
                      name="specialization"
                      placeholder="e.g., Cardiology"
                      value={formData.specialization}
                      onChange={handleChange}
                    />
                  </Field>
                </FieldGroup>
              )}

              {role === 'patient' && (
                <FieldGroup>
                  <Field>
                    <FieldLabel>Date of Birth</FieldLabel>
                    <Input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                  </Field>
                </FieldGroup>
              )}

              <FieldGroup>
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>

              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
