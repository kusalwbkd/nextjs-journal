"use client";

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { collectionSchema } from '@/app/lib/schemas';
import { BarLoader } from 'react-spinners';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

const CollectionForm = ({
    loading,
    onSuccess,
    open,
    setOpen
}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },


    } = useForm({
        resolver: zodResolver(collectionSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });
    const onSubmit = handleSubmit(async (data) => {
        onSuccess(data);
    });
    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new collection</DialogTitle>

                </DialogHeader>
                {loading && (
                    <BarLoader className="mb-4" width={"100%"} color="orange" />
                )}
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Collection Name</label>
                        <Input
                            {...register("name")}
                            placeholder="Enter collection name..."
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Description (Optional)
                        </label>
                        <Textarea
                            {...register("description")}
                            placeholder="Describe your collection..."
                            className={errors.description ? "border-red-500" : ""}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="journal">
                            Create Collection
                        </Button>
                    </div>
                </form>

            </DialogContent>
        </Dialog>

    )
}

export default CollectionForm