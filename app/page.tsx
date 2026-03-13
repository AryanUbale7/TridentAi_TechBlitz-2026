'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentUser } from '@/lib/storage'
import { Calendar, Users, Clock, Shield } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (currentUser) {
    return null // Will redirect or show user dashboard in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CD</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">CHIKITSA DESK</span>
              <p className="text-xs text-gray-500">Healthcare Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Complete Healthcare
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Management Platform</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            CHIKITSA DESK is a comprehensive healthcare management system that connects patients with doctors, manages appointments, medical records, prescriptions, and streamlines the entire healthcare experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?role=patient">
              <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg">
                Book an Appointment
              </Button>
            </Link>
            <Link href="/signup?role=doctor">
              <Button variant="outline" className="px-8 py-6 text-lg">
                Join as a Doctor
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="pt-6">
              <Calendar className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Easy Scheduling</h3>
              <p className="text-gray-600">
                Book appointments in seconds with our intuitive scheduling system
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Users className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Professional Network</h3>
              <p className="text-gray-600">
                Connect with verified healthcare professionals in your area
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Clock className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Real-time Updates</h3>
              <p className="text-gray-600">
                Receive instant notifications about your appointments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Shield className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your health data is protected with industry-standard encryption
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Create Account</h3>
              <p className="text-gray-600">
                Sign up as a patient or healthcare provider in just a few clicks
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Find Doctor</h3>
              <p className="text-gray-600">
                Browse our network of qualified professionals by specialty
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Book Appointment</h3>
              <p className="text-gray-600">
                Select your preferred date and time, and confirm your booking
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of patients and healthcare professionals using Smart Clinic
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
                Sign Up Now
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SC</span>
                </div>
                <span className="font-bold text-gray-900">Smart Clinic</span>
              </div>
              <p className="text-gray-600 text-sm">
                Modern appointment management for healthcare
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-blue-600">Features</Link></li>
                <li><Link href="#" className="hover:text-blue-600">Pricing</Link></li>
                <li><Link href="#" className="hover:text-blue-600">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-blue-600">About</Link></li>
                <li><Link href="#" className="hover:text-blue-600">Blog</Link></li>
                <li><Link href="#" className="hover:text-blue-600">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-blue-600">Privacy</Link></li>
                <li><Link href="#" className="hover:text-blue-600">Terms</Link></li>
                <li><Link href="#" className="hover:text-blue-600">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8">
            <p className="text-center text-gray-600 text-sm">
              © 2024 Smart Clinic. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
