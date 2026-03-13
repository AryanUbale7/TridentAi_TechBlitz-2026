'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, getItems, getDoctorById } from '@/lib/storage'
import { Patient, Appointment, Doctor } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, ArrowRight, Filter } from 'lucide-react'

type FilterType = 'all' | 'scheduled' | 'completed' | 'cancelled'

export default function AppointmentsPage() {
  const router = useRouter()
  const [user, setUser] = useState<Patient | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter, setFilter] = useState<FilterType>('all')

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== 'patient') {
      router.push('/login')
      return
    }
    setUser(currentUser as Patient)

    const allAppointments = getItems<Appointment>('clinic_appointments')
    const userAppointments = allAppointments.filter((apt) => apt.patientId === currentUser.id)
    setAppointments(userAppointments.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()))
  }, [router])

  const filteredAppointments =
    filter === 'all'
      ? appointments
      : appointments.filter((apt) => apt.status === filter)

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'from-blue-50 to-blue-100',
      completed: 'from-green-50 to-green-100',
      cancelled: 'from-red-50 to-red-100',
    }
    return colors[status as keyof typeof colors] || colors.scheduled
  }

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status as keyof typeof colors] || colors.scheduled
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3 text-balance">
            <div className="bg-gradient-to-br from-primary to-accent rounded-lg p-2">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            All Appointments
          </h1>
          <p className="text-muted-foreground">View your complete appointment history</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-border p-4 mb-8 flex flex-wrap gap-2">
          <Filter className="w-5 h-5 text-muted-foreground mt-1" />
          {(['all', 'scheduled', 'completed', 'cancelled'] as FilterType[]).map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? 'default' : 'outline'}
              onClick={() => setFilter(filterOption)}
              className={`capitalize ${
                filter === filterOption
                  ? 'bg-gradient-to-r from-primary to-accent hover:shadow-lg'
                  : ''
              }`}
            >
              {filterOption}
              {filterOption === 'all' && ` (${appointments.length})`}
              {filterOption === 'scheduled' && ` (${appointments.filter((a) => a.status === 'scheduled').length})`}
              {filterOption === 'completed' && ` (${appointments.filter((a) => a.status === 'completed').length})`}
              {filterOption === 'cancelled' && ` (${appointments.filter((a) => a.status === 'cancelled').length})`}
            </Button>
          ))}
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <Card className="border-0 bg-white">
            <CardContent className="pt-12 text-center pb-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground text-lg mb-4">No {filter !== 'all' ? filter : ''} appointments</p>
              {filter !== 'all' && (
                <Button
                  onClick={() => setFilter('all')}
                  variant="outline"
                  className="mt-4"
                >
                  View All Appointments
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const doctor = getDoctorById(appointment.doctorId)
              const appointmentDate = new Date(appointment.dateTime)
              const isUpcoming = appointmentDate > new Date()

              return (
                <Link key={appointment.id} href={`/patient/appointment/${appointment.id}`}>
                  <Card className={`border-0 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-r ${getStatusColor(appointment.status)}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{doctor?.name || 'Unknown Doctor'}</h3>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadgeColor(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                            {isUpcoming && (
                              <span className="text-xs font-semibold px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                Upcoming
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">{doctor?.specialization}</p>

                          <div className="flex flex-col sm:flex-row gap-4 text-sm">
                            <div className="flex items-center gap-2 text-foreground">
                              <Calendar className="w-4 h-4 text-primary" />
                              {appointmentDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </div>
                            <div className="flex items-center gap-2 text-foreground">
                              <Clock className="w-4 h-4 text-primary" />
                              {appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex items-center gap-2 text-foreground">
                              <User className="w-4 h-4 text-primary" />
                              {appointment.duration} mins
                            </div>
                          </div>

                          {appointment.notes && (
                            <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg">
                              <p className="text-sm text-foreground">
                                <span className="font-semibold">Notes:</span> {appointment.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
