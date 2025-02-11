"use client"
import React from 'react'
import { Button } from './ui/button'
import { Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'

const EditJournal = ({entryId}) => {
    const router=useRouter()
  return (
    <Button
    variant="outline"
    size="sm"
    onClick={() => router.push(`/journal/write?edit=${entryId}`)}
  >
    <Edit className="h-4 w-4 mr-2" />
    Edit
  </Button>
  )
}

export default EditJournal