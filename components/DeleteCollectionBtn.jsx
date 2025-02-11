"use client"

import React, { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Button } from './ui/button'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { deleteCollection } from '@/actions/collection'
import { toast } from 'sonner'
import useFetch from '@/hooks/use-fetch'

const DeleteCollectionBtn = ({ collectionResult, entriesCount }) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const {
        loading: isDeleting,
        fn: deleteCollectionFn,
        data: deletedCollection,
    } = useFetch(deleteCollection);

    useEffect(() => {
        if (deletedCollection && !isDeleting) {
            setOpen(false);
            toast.error(
                `Collection "${collectionResult.name}" and all its entries deleted`
            );
            router.push("/dashboard");
        }

    }, [deletedCollection, isDeleting]);
    const handleDelete = async () => {
        await deleteCollectionFn(collectionResult.id);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className='h-4 w-4' />
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>

                        Delete &quot;{collectionResult?.name} &quot;?
                    </AlertDialogTitle>
                    <div className="space-y-2 text-muted-foreground text-sm">

                        <p>This will permanently delete:</p>
                        <ul className="list-disc list-inside">
                            <li>The collection &quot;{collectionResult?.name}&quot;</li>
                            <li>
                                {entriesCount} journal{" "}
                                {entriesCount === 1 ? "entry" : "entries"}
                            </li>
                        </ul>
                        <p className="font-semibold text-red-600">
                            This action cannot be undone.
                        </p>
                    </div>

                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600"
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete Collection"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default DeleteCollectionBtn