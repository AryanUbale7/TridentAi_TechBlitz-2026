'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Patient, Doctor, Appointment } from '@/lib/types'
import {
  getCurrentUser,
  getDoctors,
  getItems,
  addItem,
  initializeStorage,
} from '@/lib/storage'
import Link from 'next/link'
import { ArrowLeft, Clock, User } from 'lucide-react'

export default function BookAppointmentPage() {
  const router = useRouter()
  const [user, setUser] = useState<Patient | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    initializeStorage()
    const currentUser = getCurrentUser()

    if (!currentUser) {
      router.push('/login')
      return
    }

    if (currentUser.role !== 'patient') {
      router.push('/doctor/dashboard')
      return
    }

    setUser(currentUser as Patient)
    setDoctors(getDoctors())
    setLoading(false)
  }, [router])

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getTimeSlots = () => {
    if (!selectedDoctor) return []

    // Generate time slots from 9 AM to 5 PM, every 30 minutes
    const slots = []
    const start = 9 // 9 AM
    const end = 17 // 5 PM

    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
    }

    return slots
  }

  const isTimeAvailable = (doctorId: string, dateTime: string) => {
    const appointments = getItems<Appointment>('clinic_appointments')
    return !appointments.some((apt) => apt.doctorId === doctorId && apt.dateTime === dateTime && apt.status !== 'cancelled')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (!selectedDoctor || !date || !time || !user) {
        setError('Please fill in all required fields')
        setSubmitting(false)
        return
      }

      const dateTime = `${date}T${time}`

      if (!isTimeAvailable(selectedDoctor.id, dateTime)) {
        setError('This time slot is already booked. Please choose another.')
        setSubmitting(false)
        return
      }

      // Create appointment
      const appointment: Appointment = {
        id: `apt-${Date.now()}`,
        patientId: user.id,
        doctorId: selectedDoctor.id,
        clinicId: 'clinic-001',
        dateTime: dateTime,
        duration: 30,
        status: 'scheduled',
        notes: notes,
        createdAt: new Date().toISOString(),
      }

      addItem('clinic_appointments', appointment)
      setSuccess(true)

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/patient/dashboard')
      }, 2000)
    } catch (err) {
      setError('An error occurred while booking the appointment.')
      console.error(err)
    } finally {
      setSubmitting(false)
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
          <Link href="/patient/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Book an Appointment</CardTitle>
            <CardDescription>Schedule a consultation with our healthcare professionals</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Appointment Booked!</h3>
                <p className="text-gray-600 mb-4">
                  Your appointment has been successfully scheduled. You will be redirected to your dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Select Doctor</FieldLabel>
                    <select
                      value={selectedDoctor?.id || ''}
                      onChange={(e) => {
                        const doctor = doctors.find((d) => d.id === e.target.value)
                        setSelectedDoctor(doctor || null)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Choose a doctor...</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  </Field>
                </FieldGroup>

                {selectedDoctor && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Doctor</p>
                          <p className="font-semibold flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {selectedDoctor.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Specialization</p>
                          <p className="font-semibold">{selectedDoctor.specialization}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">License</p>
                          <p className="font-semibold">{selectedDoctor.licenseNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-semibold">{selectedDoctor.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <FieldGroup>
                  <Field>
                    <FieldLabel>Date</FieldLabel>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={getTodayDate()}
                      required
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Time</FieldLabel>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a time...</option>
                      {getTimeSlots().map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Notes (Optional)</FieldLabel>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any additional information or concerns..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </Field>
                </FieldGroup>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <Link href="/patient/dashboard" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={submitting}
                  >
                    {submitting ? 'Booking...' : 'Book Appointment'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
