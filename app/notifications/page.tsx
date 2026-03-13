'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getNotifications, markNotificationAsRead } from '@/lib/storage'
import { Patient, Doctor, Notification } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Check, Trash2, AlertCircle, Calendar, Pill, MessageSquare } from 'lucide-react'

const notificationIcons: Record<string, any> = {
  appointment: Calendar,
  reminder: Bell,
  prescription: Pill,
  message: MessageSquare,
}

export default function NotificationsPage() {
  const router = useRouter()
  const [user, setUser] = useState<(Patient | Doctor) | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)
    setNotifications(getNotifications(currentUser.id))
  }, [router])

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId)
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    )
  }

  const handleDelete = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-accent rounded-lg p-2">
                <Bell className="w-6 h-6 text-white" />
              </div>
              Notifications
            </h1>
            <p className="text-muted-foreground">Stay updated with your appointments and messages</p>
          </div>
          {unreadCount > 0 && (
            <div className="text-right">
              <div className="bg-red-100 text-red-800 rounded-full px-4 py-2 font-semibold">
                {unreadCount} new
              </div>
            </div>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card className="border-0 bg-white">
            <CardContent className="pt-12 text-center pb-12">
              <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground text-lg mb-2">No notifications yet</p>
              <p className="text-muted-foreground text-sm">You're all caught up! Check back later for updates.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const IconComponent = notificationIcons[notification.type] || Bell
              return (
                <div
                  key={notification.id}
                  className={`rounded-xl border transition-all duration-200 ${
                    notification.read
                      ? 'bg-white border-border'
                      : 'bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20'
                  }`}
                >
                  <div className="p-4 flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                        notification.read ? 'bg-muted text-muted-foreground' : 'bg-primary text-white'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow">
                          <h3 className={`font-semibold ${notification.read ? 'text-foreground' : 'text-foreground'}`}>
                            {notification.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(notification.createdAt).toLocaleDateString()}{' '}
                            {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex gap-2">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="hover:bg-primary/10"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(notification.id)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
