'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getDoctorById, getReviews, addReview } from '@/lib/storage'
import { Patient, Review } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star } from 'lucide-react'
import { generateId } from '@/lib/utils-gen'

export default function DoctorReviewsPage({ params }: { params: { doctorId: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<Patient | null>(null)
  const [doctor, setDoctor] = useState<any>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== 'patient') {
      router.push('/login')
      return
    }
    setUser(currentUser as Patient)

    const doctorData = getDoctorById(params.doctorId)
    setDoctor(doctorData)
    setReviews(getReviews(params.doctorId))
  }, [params.doctorId, router])

  const handleSubmitReview = async () => {
    if (!user || !doctor) return

    setIsLoading(true)
    try {
      const newReview: Review = {
        id: generateId(),
        doctorId: doctor.id,
        patientId: user.id,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      }

      addReview(newReview)
      setReviews([newReview, ...reviews])
      setRating(5)
      setComment('')
      setSubmitted(true)

      setTimeout(() => setSubmitted(false), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || !doctor) return null

  const avgRating = doctor.rating
  const totalReviews = doctor.reviewCount

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Doctor Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{doctor.name}</h1>
          <p className="text-primary font-semibold mb-4">{doctor.specialization}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground">{avgRating}</span>
              <span className="text-muted-foreground ml-2">({totalReviews} reviews)</span>
            </div>
          </div>
        </div>

        {/* Write Review Section */}
        <Card className="mb-8 border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle>Share Your Experience</CardTitle>
            <CardDescription>Help other patients make informed decisions</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {submitted && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                Thank you! Your review has been submitted successfully.
              </div>
            )}

            <div className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Your Review</label>
                <Textarea
                  placeholder="Share your experience with this doctor..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-32"
                />
              </div>

              <Button
                onClick={handleSubmitReview}
                disabled={!comment.trim() || isLoading}
                className="bg-gradient-to-r from-primary to-accent hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">All Reviews ({reviews.length})</h2>

          {reviews.length === 0 ? (
            <Card className="border-0 bg-white">
              <CardContent className="pt-8 text-center pb-8">
                <p className="text-muted-foreground">No reviews yet. Be the first to review this doctor!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="border-0 bg-white hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-foreground text-sm leading-relaxed">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
