'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Doctor, Appointment, Patient } from '@/lib/types'
import { getCurrentUser, clearCurrentUser, initializeStorage, getItems, getPatientById } from '@/lib/storage'
import Link from 'next/link'
import { Calendar, Users, CheckCircle, LogOut, Clock, TrendingUp, Pill, ArrowRight } from 'lucide-react'

export default function DoctorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<Doctor | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    completed: 0,
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

    // Get doctor's appointments
    const allAppointments = getItems<Appointment>('clinic_appointments')
    const doctorAppointments = allAppointments.filter((apt) => apt.doctorId === currentUser.id)
    const sorted = doctorAppointments.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    setAppointments(sorted)

    // Calculate stats
    setStats({
      total: doctorAppointments.length,
      scheduled: doctorAppointments.filter((apt) => apt.status === 'scheduled').length,
      completed: doctorAppointments.filter((apt) => apt.status === 'completed').length,
    })

    setLoading(false)
  }, [router])

  const handleLogout = () => {
    clearCurrentUser()
    router.push('/login')
  }

  const getPatientInfo = (patientId: string): Patient | null => {
    return getPatientById(patientId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Smart Clinic</h1>
              <p className="text-xs text-gray-500">Doctor Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Dr. {user.name.split(' ')[user.name.split(' ').length - 1]}</span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-2 text-balance">Welcome back, Dr. {user.name.split(' ').pop()}! 👨‍⚕️</h2>
          <p className="text-muted-foreground text-lg">Manage your appointments, patient records, and prescriptions</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/doctor/schedule" className="block">
            <Card className="border-0 bg-gradient-to-br from-primary to-accent hover:shadow-lg transition-all h-full cursor-pointer">
              <CardContent className="pt-6 text-center h-full flex flex-col items-center justify-center">
                <Calendar className="w-8 h-8 text-white mb-2" />
                <p className="font-semibold text-white text-sm">View Schedule</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/doctor/profile" className="block">
            <Card className="border-0 bg-white hover:shadow-lg transition-all h-full cursor-pointer">
              <CardContent className="pt-6 text-center h-full flex flex-col items-center justify-center">
                <Users className="w-8 h-8 text-primary mb-2" />
                <p className="font-semibold text-foreground text-sm">My Profile</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/notifications" className="block">
            <Card className="border-0 bg-white hover:shadow-lg transition-all h-full cursor-pointer">
              <CardContent className="pt-6 text-center h-full flex flex-col items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary mb-2" />
                <p className="font-semibold text-foreground text-sm">Notifications</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="border-0 bg-white">
            <CardContent className="pt-6 text-center h-full flex flex-col items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary mb-2" />
              <p className="font-semibold text-foreground text-sm">Performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 bg-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stats.total}</div>
                <p className="text-sm text-muted-foreground">Total Appointments</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.scheduled}</div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.completed}</div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{user.rating}</div>
                <p className="text-sm text-muted-foreground">Rating ({user.reviewCount})</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <Card className="border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Your Appointments</CardTitle>
                <CardDescription className="mt-1">
                  {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              <Link href="/doctor/schedule">
                <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Full Schedule
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                <p className="text-muted-foreground text-lg">No appointments scheduled</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.slice(0, 5).map((appointment) => {
                  const patient = getPatientInfo(appointment.patientId)
                  const isUpcoming = new Date(appointment.dateTime) > new Date()
                  return (
                    <Link key={appointment.id} href={`/doctor/appointment/${appointment.id}`}>
                      <Card className={`border-0 hover:shadow-md transition-all cursor-pointer ${isUpcoming ? 'bg-gradient-to-r from-blue-50 to-cyan-50' : 'bg-gradient-to-r from-white to-gray-50'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-foreground">{patient?.name || 'Unknown Patient'}</h3>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadge(appointment.status)}`}>
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </span>
                                {isUpcoming && (
                                  <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                    Upcoming
                                  </span>
                                )}
                              </div>
                              <p className="text-muted-foreground text-sm mb-2">{patient?.email}</p>
                              <p className="text-foreground text-sm flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                {formatDate(appointment.dateTime)}
                              </p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
                {appointments.length > 5 && (
                  <div className="pt-4 text-center">
                    <Link href="/doctor/schedule">
                      <Button variant="outline" className="w-full">
                        View All Appointments
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
