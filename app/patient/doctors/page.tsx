'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getDoctors } from '@/lib/storage'
import { Doctor } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, MapPin, Clock, Award } from 'lucide-react'

const SPECIALTIES = ['General Medicine', 'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics']

export default function DoctorsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('')
  const [minRating, setMinRating] = useState(0)
  const doctors = getDoctors()

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.bio.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSpecialty = !selectedSpecialty || doctor.specialization === selectedSpecialty
      const matchesRating = doctor.rating >= minRating
      return matchesSearch && matchesSpecialty && matchesRating
    })
  }, [searchTerm, selectedSpecialty, minRating, doctors])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Find Your Doctor</h1>
          <p className="text-muted-foreground text-lg">Browse and book appointments with qualified healthcare professionals</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 mb-8 backdrop-blur-xl bg-opacity-95">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Search by name or specialty</label>
              <Input
                type="text"
                placeholder="Enter doctor name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Specialization</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-white text-foreground"
              >
                <option value="">All Specialties</option>
                {SPECIALTIES.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Minimum Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-white text-foreground"
              >
                <option value={0}>All Ratings</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setSearchTerm('')
                setSelectedSpecialty('')
                setMinRating(0)
              }}
              variant="outline"
              className="w-full md:w-auto"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Results */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No doctors found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white">
                <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{doctor.name}</CardTitle>
                      <CardDescription className="text-primary font-semibold">{doctor.specialization}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-foreground mb-4 line-clamp-2">{doctor.bio}</p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award className="w-4 h-4 text-primary" />
                      <span>{doctor.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>Available today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-foreground">{doctor.rating}</span>
                      <span className="text-xs text-muted-foreground">({doctor.reviewCount})</span>
                    </div>
                  </div>

                  <Link href={`/patient/book-appointment?doctorId=${doctor.id}`}>
                    <Button className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg">
                      Book Appointment
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
