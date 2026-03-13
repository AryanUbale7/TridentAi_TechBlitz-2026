'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getAppointments, updateAppointment } from '@/lib/storage'
import { Doctor, Appointment } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react'

export default function DoctorSchedulePage() {
  const router = useRouter()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== 'doctor') {
      router.push('/login')
      return
    }
    setDoctor(currentUser as Doctor)

    const allAppointments = getAppointments().filter((a) => a.doctorId === currentUser.id)
    setAppointments(allAppointments)
  }, [router])

  const getWeekDays = (date: string) => {
    const current = new Date(date)
    const week = []
    const dayOfWeek = current.getDay()
    const diff = current.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    const monday = new Date(current.setDate(diff))

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday)
      day.setDate(day.getDate() + i)
      week.push(day.toISOString().split('T')[0])
    }
    return week
  }

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter((a) => a.dateTime.split('T')[0] === date)
  }

  const handleStatusChange = (appointmentId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    const appointment = appointments.find((a) => a.id === appointmentId)
    if (appointment) {
      appointment.status = newStatus
      updateAppointment(appointment)
      setAppointments([...appointments])
    }
  }

  if (!doctor) return null

  const weekDays = getWeekDays(selectedDate)
  const upcomingAppointments = appointments
    .filter((a) => a.status === 'scheduled')
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())

  const completedCount = appointments.filter((a) => a.status === 'completed').length
  const cancelledCount = appointments.filter((a) => a.status === 'cancelled').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Schedule Management</h1>
          <p className="text-muted-foreground">View and manage your appointments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 bg-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{appointments.length}</div>
                <p className="text-sm text-muted-foreground">Total Appointments</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{upcomingAppointments.length}</div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{completedCount}</div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">{cancelledCount}</div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-border rounded-xl p-1">
            <TabsTrigger value="upcoming" className="rounded-lg">
              <Calendar className="w-4 h-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="week" className="rounded-lg">
              <Clock className="w-4 h-4 mr-2" />
              Weekly View
            </TabsTrigger>
            <TabsTrigger value="all" className="rounded-lg">
              <User className="w-4 h-4 mr-2" />
              All Appointments
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Tab */}
          <TabsContent value="upcoming" className="mt-6 space-y-4">
            {upcomingAppointments.length === 0 ? (
              <Card className="border-0 bg-white">
                <CardContent className="pt-8 text-center pb-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No upcoming appointments</p>
                </CardContent>
              </Card>
            ) : (
              upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="border-0 bg-white hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-foreground">
                            {new Date(appointment.dateTime).toLocaleDateString()} at{' '}
                            {new Date(appointment.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Duration: {appointment.duration} minutes
                        </p>
                        {appointment.notes && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900 mb-3">
                            <span className="font-semibold">Notes:</span> {appointment.notes}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(appointment.id, 'completed')}
                          className="hover:bg-green-50"
                        >
                          <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                          className="hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1 text-red-600" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Weekly View Tab */}
          <TabsContent value="week" className="mt-6">
            <Card className="border-0 bg-white">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle>Week View</CardTitle>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day) => {
                    const dayAppointments = getAppointmentsForDate(day)
                    const date = new Date(day)
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
                    const dayNum = date.getDate()

                    return (
                      <div key={day} className="border border-border rounded-lg p-3 min-h-32">
                        <div className="font-semibold text-foreground mb-2">
                          {dayName} {dayNum}
                        </div>
                        <div className="space-y-2">
                          {dayAppointments.length === 0 ? (
                            <p className="text-xs text-muted-foreground">No appointments</p>
                          ) : (
                            dayAppointments.map((apt) => (
                              <div key={apt.id} className="text-xs bg-primary/10 text-primary rounded px-2 py-1 truncate">
                                {new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Appointments Tab */}
          <TabsContent value="all" className="mt-6 space-y-4">
            {appointments.length === 0 ? (
              <Card className="border-0 bg-white">
                <CardContent className="pt-8 text-center pb-8">
                  <User className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No appointments found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {appointments
                  .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
                  .map((appointment) => (
                    <Card key={appointment.id} className="border-0 bg-white">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-foreground">
                              {new Date(appointment.dateTime).toLocaleDateString()} at{' '}
                              {new Date(appointment.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full mt-2 inline-block ${
                                appointment.status === 'scheduled'
                                  ? 'bg-blue-100 text-blue-800'
                                  : appointment.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
