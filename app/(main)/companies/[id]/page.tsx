'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Eye, Star, MoreVertical } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Company {
  _id: string
  name: string
  email: string
  phone: string
  imageUrl: string
  status: string
  employeesCount: number
  description?: string
  website?: string
  address?: string
}

interface Employee {
  _id: string
  name: string
  email: string
  position?: string
  department?: string
}

export default function CompanyDetails() {
  const { id } = useParams()
  const router = useRouter()
  const [company, setCompany] = useState<Company | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await fetch(`/api/company/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch company details')
        }
        const data = await response.json()
        setCompany(data.company)
        setEmployees(data.employees)
      } catch (error) {
        console.error('Error fetching company details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanyDetails()
  }, [id])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex flex-col gap-8">
          <Button variant="outline" className="w-24" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <Skeleton className="h-8 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="container py-8">
        <div className="flex flex-col gap-8">
          <Button variant="outline" className="w-24" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center py-12">
            <h3 className="text-xl font-medium">Company not found</h3>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden">
                  {company.imageUrl && (
                    <img
                      src={company.imageUrl}
                      alt={company.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <CardTitle className="text-center">{company.name}</CardTitle>
                <Badge
                  variant={company.status === 'active' ? 'default' : 'secondary'}
                >
                  {company.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p>{company.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                <p>{company.phone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Employees</h4>
                <p>{company.employeesCount}</p>
              </div>
              {company.website && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Website</h4>
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {company.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Details and Employees Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {company.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">About</h4>
                  <p className="whitespace-pre-line">{company.description}</p>
                </div>
              )}
              
              {company.address && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Address</h4>
                  <p className="whitespace-pre-line">{company.address}</p>
                </div>
              )}

              <div className="pt-4">
                <h4 className="text-lg font-medium mb-4">Employees ({employees.length})</h4>
                {employees.length > 0 ? (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employees.map((employee) => (
                          <TableRow key={employee._id}>
                            <TableCell className="font-medium">
                              {employee.name}
                            </TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>
                              {employee.position || '-'}
                            </TableCell>
                            <TableCell>
                              {employee.department || '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white">
                                  <DropdownMenuItem
                                    onClick={() => router.push(`/employees/${employee._id}`)}
                                    className="flex items-center gap-2"
                                  >
                                    <Eye className="h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => router.push(`/employees/${employee._id}/reviews`)}
                                    className="flex items-center gap-2"
                                  >
                                    <Star className="h-4 w-4" />
                                    Review
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No employees found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}