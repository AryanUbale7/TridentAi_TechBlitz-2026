'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Patient, Appointment, Doctor } from '@/lib/types'
import { getCurrentUser, getItems, updateItem, getDoctorById, initializeStorage } from '@/lib/storage'
import Link from 'next/link'
import { ArrowLeft, Calendar, Phone, Mail, Stethoscope } from 'lucide-react'

export default function AppointmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [user, setUser] = useState<Patient | null>(null)
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)

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

    // Get appointment
    const allAppointments = getItems<Appointment>('clinic_appointments')
    const found = allAppointments.find((apt) => apt.id === id)

    if (found) {
      setAppointment(found)
      const doc = getDoctorById(found.doctorId)
      setDoctor(doc)
    }

    setLoading(false)
  }, [router, id])

  const handleCancel = () => {
    if (appointment && confirm('Are you sure you want to cancel this appointment?')) {
      const updated = { ...appointment, status: 'cancelled' as const }
      updateItem('clinic_appointments', updated)
      setAppointment(updated)

      setTimeout(() => {
        router.push('/patient/dashboard')
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

  if (loading || !user || !appointment || !doctor) {
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Appointment Details</CardTitle>
                <CardDescription>View and manage your appointment</CardDescription>
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

            {/* Doctor Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Doctor Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Doctor Name</p>
                    <p className="text-lg font-semibold text-gray-900">{doctor.name}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Specialization</p>
                    <p className="text-lg font-semibold text-gray-900">{doctor.specialization}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">License Number</p>
                    <p className="text-lg font-semibold text-gray-900">{doctor.licenseNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </p>
                    <p className="font-semibold text-gray-900">{doctor.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </p>
                    <p className="font-semibold text-gray-900">{doctor.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Bio</p>
                  <p className="text-gray-900">{doctor.bio}</p>
                </div>
              </div>
            </div>

            {/* Patient Notes */}
            {appointment.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Notes</h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-700">{appointment.notes}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Link href="/patient/dashboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Back to Appointments
                </Button>
              </Link>
              {appointment.status === 'scheduled' && (
                <Button
                  type="button"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleCancel}
                >
                  Cancel Appointment
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
