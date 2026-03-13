'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Doctor, Appointment, Patient } from '@/lib/types'
import { getCurrentUser, getItems, updateItem, getPatientById, initializeStorage } from '@/lib/storage'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Mail, Phone } from 'lucide-react'

export default function AppointmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [user, setUser] = useState<Doctor | null>(null)
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

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

    // Get appointment
    const allAppointments = getItems<Appointment>('clinic_appointments')
    const found = allAppointments.find((apt) => apt.id === id)

    if (found) {
      setAppointment(found)
      setNotes(found.notes || '')
      const pat = getPatientById(found.patientId)
      setPatient(pat)
    }

    setLoading(false)
  }, [router, id])

  const handleMarkCompleted = () => {
    if (appointment && confirm('Mark this appointment as completed?')) {
      const updated = { ...appointment, status: 'completed' as const }
      updateItem('clinic_appointments', updated)
      setAppointment(updated)

      setTimeout(() => {
        router.push('/doctor/dashboard')
      }, 1500)
    }
  }

  const handleSaveNotes = async () => {
    if (appointment) {
      setSaving(true)
      const updated = { ...appointment, notes }
      updateItem('clinic_appointments', updated)
      setAppointment(updated)
      setIsEditing(false)
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (appointment && confirm('Are you sure you want to cancel this appointment?')) {
      const updated = { ...appointment, status: 'cancelled' as const }
      updateItem('clinic_appointments', updated)
      setAppointment(updated)

      setTimeout(() => {
        router.push('/doctor/dashboard')
      }, 1500)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return styles[status as keyof typeof styles] || styles.scheduled
  }

  if (loading || !user || !appointment || !patient) {
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Appointment Details</CardTitle>
                <CardDescription>Manage patient appointment</CardDescription>
              </div>
              <span className={`text-sm font-semibold px-4 py-2 rounded-full ${getStatusBadge(appointment.status)}`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Appointment Date & Time */}
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-4">
                <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Appointment Date & Time</p>
                  <p className="text-xl font-semibold text-gray-900">{formatDate(appointment.dateTime)}</p>
                  <p className="text-sm text-gray-600 mt-2">Duration: {appointment.duration} minutes</p>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Patient Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Patient Name</p>
                    <p className="text-lg font-semibold text-gray-900">{patient.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </p>
                    <p className="font-semibold text-gray-900">{patient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </p>
                    <p className="font-semibold text-gray-900">{patient.phone}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Date of Birth</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Address</p>
                  <p className="font-semibold text-gray-900">{patient.address}</p>
                </div>
              </div>
            </div>

            {/* Patient Notes */}
            {appointment.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Concerns/Notes</h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-700">{appointment.notes}</p>
                </div>
              </div>
            )}

            {/* Doctor Notes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Notes</h3>
              {!isEditing ? (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                  {notes ? (
                    <p className="text-gray-700">{notes}</p>
                  ) : (
                    <p className="text-gray-500 italic">No notes yet. Click edit to add notes.</p>
                  )}
                </div>
              ) : (
                <div className="mb-4">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your examination notes, diagnosis, recommendations..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex gap-2">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Notes
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleSaveNotes}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Notes'}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Link href="/doctor/dashboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Back to Dashboard
                </Button>
              </Link>
              {appointment.status === 'scheduled' && (
                <>
                  <Button
                    type="button"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={handleMarkCompleted}
                  >
                    Mark as Completed
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={handleCancel}
                  >
                    Cancel Appointment
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
