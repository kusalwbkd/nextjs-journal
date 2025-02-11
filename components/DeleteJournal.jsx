"use client"

import React, { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Button } from './ui/button'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { deleteCollection } from '@/actions/collection'
import { toast } from 'sonner'
import useFetch from '@/hooks/use-fetch'
import { deleteJournalEntry } from '@/actions/journal'

const DeleteJournal = ({ entryId }) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const {
        loading: isDeleting,
        fn: deleteJournalEntryFn,
        data: deleteJournalEntryData,
    } = useFetch(deleteJournalEntry);

    useEffect(() => {
        if (deleteJournalEntryData && !isDeleting) {
            setOpen(false);
            toast.error(
                'Journal entry deleted!'
            );
            router.push(
                `/collection/${deleteJournalEntryData?.collectionId ? deleteJournalEntryData?.collectionId : "unorganized"
                }`
            );
        }

    }, [deleteJournalEntryData, isDeleting]);
    const handleDelete = async () => {
        await deleteJournalEntryFn(entryId);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              journal entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    )
}

export default DeleteJournal