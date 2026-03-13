'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Doctor } from '@/lib/types'
import { getCurrentUser, updateItem, initializeStorage } from '@/lib/storage'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default function DoctorProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    bio: '',
  })

  useEffect(() => {
    initializeStorage()
    const currentUser = getCurrentUser()

    if (!currentUser) {
      router.push('/login')
      return
    }

    if (currentUser.role !== 'doctor') {
      router.push('/patient/dashboard')
      return
    }

    setUser(currentUser as Doctor)
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      specialization: currentUser.specialization,
      licenseNumber: currentUser.licenseNumber,
      bio: currentUser.bio,
    })
    setLoading(false)
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const updated: Doctor = {
        ...user,
        ...formData,
      }
      updateItem('clinic_doctors', updated)
      setUser(updated)
      // Also update current user in storage
      const currentStorage = localStorage.getItem('clinic_current_user')
      if (currentStorage) {
        localStorage.setItem('clinic_current_user', JSON.stringify(updated))
      }
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating profile:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/doctor/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Doctor Profile</CardTitle>
            <CardDescription>Manage your professional information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                      {formData.name}
                    </div>
                  )}
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                    {formData.email}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Phone Number</FieldLabel>
                  {isEditing ? (
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                      {formData.phone}
                    </div>
                  )}
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Specialization</FieldLabel>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                      {formData.specialization}
                    </div>
                  )}
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>License Number</FieldLabel>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                      {formData.licenseNumber}
                    </div>
                  )}
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Professional Bio</FieldLabel>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell patients about your experience and expertise..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 min-h-20">
                      {formData.bio}
                    </div>
                  )}
                </Field>
              </FieldGroup>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Note:</strong> Clinic ID and available hours are managed separately. Contact your clinic administrator to update these settings.
                </p>
              </div>

              <div className="flex gap-4">
                <Link href="/doctor/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Back to Dashboard
                  </Button>
                </Link>
                {!isEditing ? (
                  <Button
                    type="button"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
