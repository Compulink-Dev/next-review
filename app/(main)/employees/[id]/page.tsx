'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface User {
  _id: string
  name: string
  email: string
  role: string
  position?: string
  department?: string
  company?: {
    _id: string
    name: string
    email?: string
    phone?: string
    website?: string
  }
}

export default function UserDetails() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/users/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch user details')
        }
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [id])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex flex-col gap-8">
          <Button variant="outline" className="w-24" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[180px]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container py-8">
        <div className="flex flex-col gap-8">
          <Button variant="outline" className="w-24" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center py-12">
            <h3 className="text-xl font-medium">User not found</h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <Button variant="outline" className="w-24" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              {/* User Profile */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}`} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p>{user.email}</p>
                  </div>
                  {user.position && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Position</h4>
                      <p>{user.position}</p>
                    </div>
                  )}
                  {user.department && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Department</h4>
                      <p>{user.department}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Details */}
              {user.company && (
                <div className="flex-1 space-y-6 border-l md:pl-8">
                  <h3 className="text-lg font-semibold">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Company Name</h4>
                      <p>{user.company.name}</p>
                    </div>
                    {user.company.email && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Company Email</h4>
                        <p>{user.company.email}</p>
                      </div>
                    )}
                    {user.company.phone && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Company Phone</h4>
                        <p>{user.company.phone}</p>
                      </div>
                    )}
                    {user.company.website && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Website</h4>
                        <a 
                          href={user.company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {user.company.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* <div className="flex gap-4 pt-8">
              <Button onClick={() => router.push(`/users/${id}/edit`)}>
                Edit User
              </Button>
              <Button variant="outline" className="text-red-600">
                Delete User
              </Button>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}