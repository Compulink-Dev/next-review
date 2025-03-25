'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Rating } from '@/components/Rating'

interface Review {
  _id: string
  user: {
    _id: string
    name: string
    imageUrl?: string
  }
  rating: number
  comment?: string
  createdAt: string
}

interface Category {
  _id: string
  name: string
  description: string
  imageUrl: string
  averageRating: number
  reviews: Review[]
  companies: Array<{
    _id: string
    name: string
    imageUrl: string
  }>
}

function CategoryPage() {
  const router = useRouter()
const { id } = useParams() as { id: string };
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [review, setReview] = useState({
    rating: 0,
    comment: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${id}`)
        const data = await response.json()
        setCategory(data)
      } catch (error) {
        console.error('Error fetching category:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [id])

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch(`/api/categories/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'current-user-id', // Replace with actual user ID from your auth system
          rating: review.rating,
          comment: review.comment,
        }),
      })

      if (response.ok) {
        const updatedCategory = await response.json()
        setCategory(updatedCategory.category)
        setReview({ rating: 0, comment: '' })
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Category not found</h2>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-shrink-0">
            <Avatar className="w-16 h-16">
              <AvatarImage src={category.imageUrl} />
              <AvatarFallback>{category.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-grow">
            <CardTitle className="text-2xl">{category.name}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
            <div className="mt-2 flex items-center">
              <Rating value={category.averageRating} readOnly />
              <span className="ml-2 text-sm text-gray-600">
                ({category.reviews.length} reviews)
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Companies in this category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {category.companies.map((company) => (
              <Card key={company._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={company.imageUrl} />
                    <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{company.name}</h4>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto"
                      onClick={() => router.push(`/companies/${company._id}`)}
                    >
                      View details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Reviews</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">Add Review</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Your Review</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1">Rating</label>
                    <Rating
                      value={review.rating}
                      onChange={(value) => setReview({ ...review, rating: value })}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Comment (optional)</label>
                    <Textarea
                      value={review.comment}
                      onChange={(e) =>
                        setReview({ ...review, comment: e.target.value })
                      }
                      placeholder="Share your experience..."
                    />
                  </div>
                  <Button type="submit" disabled={submitting || review.rating === 0}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {category.reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            ) : (
              category.reviews.map((review) => (
                <Card key={review._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={review.user.imageUrl} />
                        <AvatarFallback>
                          {review.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{review.user.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      <Rating value={review.rating} readOnly size="sm" />
                    </div>
                    {review.comment && (
                      <p className="text-gray-700">{review.comment}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage