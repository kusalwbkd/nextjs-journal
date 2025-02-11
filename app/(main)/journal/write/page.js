"use client";

import { journalSchema } from '@/app/lib/schemas';
import dynamic from 'next/dynamic';
import React, { useDebugValue, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import "react-quill-new/dist/quill.snow.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarLoader } from 'react-spinners';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMoodById, MOODS } from '@/app/lib/moods';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch';
import { createJournalEntry, getDraft, getJournalEntry, saveDraft, updateJournalEntry } from '@/actions/journal';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { createCollection, getCollections } from '@/actions/collection';
import CollectionForm from '@/components/CollectionForm';
import { Loader2 } from 'lucide-react';


const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });



const JournalWrite = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        setValue,
        getValues,
        watch,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(journalSchema),
        defaultValues: {
            title: "",
            content: "",
            mood: "",
            collectionId: "",
        },
    });


    const {
        loading: entryLoading,
        fn: editFn,
        data: entryResult,
    } = useFetch(getJournalEntry);

    const {
        loading: draftLoading,
        fn: draftFn,
        data: draftResult,
    } = useFetch(getDraft);

    const {
        loading: SavedraftLoading,
        fn: SavedraftFn,
        data: SavedraftResult,
    } = useFetch(saveDraft);

    const {
        loading: actionLoading,
        fn: actionFn,
        data: actionResult,
    } = useFetch(isEditMode ? updateJournalEntry : createJournalEntry);

    const {
        loading: collectionLoading,
        fn: collectionFn,
        data: collectionResult,
    } = useFetch(getCollections);

    const {
        loading: createCollectionLoading,
        fn: createCollectionFn,
        data: createCollectionResult,
    } = useFetch(createCollection);

    useEffect(() => {
        collectionFn()
        if (editId) {
            setIsEditMode(true)
            editFn()

        } else {
            setIsEditMode(false)
            draftFn()
        }
    }, [editId])

    useEffect(() => {
        if (isEditMode && entryResult) {
            reset({
                title: entryResult?.title || "",
                content: entryResult?.content || "",
                mood: entryResult?.mood || "",
                collectionId: entryResult?.collectionId || "",
            });
        } else if (draftResult?.success && draftResult?.data) {
            reset({
                title: draftResult.data.title || "",
                content: draftResult.data.content || "",
                mood: draftResult.data.mood || "",
                collectionId: "",
            });
        } else {
            reset({
                title: "",
                content: "",
                mood: "",
                collectionId: "",
            });
        }

    }, [draftResult, isEditMode, entryResult])


    const isLoading = actionLoading || collectionLoading || createCollectionLoading || entryLoading || draftLoading || SavedraftLoading

    useEffect(() => {
        if (actionResult && !actionLoading) {
            if (!isEditMode) {
                SavedraftFn({ title: "", content: "", mood: "" });
            }
            router.push(`/collection/${actionResult.collectionId ? actionResult.collectionId : "unorganized"}`)
            toast.success(
                `Entry ${isEditMode ? "updated" : "created"} successfully!`
            );
        }
    }, [actionResult, actionLoading])
    useEffect(() => {
        if (createCollectionResult) {
            setIsCollectionDialogOpen(false)
            collectionFn()
            setValue("collectionId", createCollectionResult.id);
            toast.success(`Collection ${createCollectionResult.name} created!`);
        }

    }, [createCollectionResult])

    const onSubmit = handleSubmit(async (data) => {
        const mood = getMoodById(data.mood);
        actionFn({
            ...data,
            moodScore: mood.score,
            moodQuery: mood.pixabayQuery,
            ...(isEditMode && { id: editId }),

        });

    })

    const formData = watch();

    const handleSaveDraft = async () => {
        if (!isDirty) {
            toast.error("No changes to save");
            return;
        }
        const result = await SavedraftFn(formData);
        if (result?.success) {
            toast.success("Draft saved successfully");
        }
    };

    const handleCreateCollection = async (data) => {
        createCollectionFn(data)
    }
    return (


        <div className="container mx-auto px-4 py-8">
            <form className='space-y-2  mx-auto' onSubmit={onSubmit}>
                <h1 className="text-5xl md:text-6xl gradient-title">
                    {isEditMode ? "Edit Entry" : "What's on your mind?"}
                </h1>

                {isLoading && (
                    <BarLoader className="mb-4" width={"100%"} color="orange" />
                )}

                <div className='space-y-2'>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                        disabled={isLoading}
                        {...register("title")}
                        placeholder="Give your entry a title..."
                        className={`py-5 md:text-md ${errors.title ? "border-red-500" : ""
                            }`}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm">{errors.title.message}</p>
                    )}

                </div>


                <div className="space-y-2">
                    <label className="text-sm font-medium">How are you feeling?</label>
                    <Controller
                        name="mood"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className={errors.mood ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select a mood..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(MOODS).map((mood) => (
                                        <SelectItem key={mood.id} value={mood.id}>
                                            <span className="flex items-center gap-2">
                                                {mood.emoji} {mood.label}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.mood && (
                        <p className="text-red-500 text-sm">{errors.mood.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        {getMoodById(watch("mood"))?.prompt ?? "Write your thoughts..."}
                    </label>
                    <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                            <ReactQuill
                                readOnly={isLoading}
                                theme="snow"
                                value={field.value}
                                onChange={field.onChange}
                                modules={{
                                    toolbar: [
                                        [{ header: [1, 2, 3, false] }],
                                        ["bold", "italic", "underline", "strike"],
                                        [{ list: "ordered" }, { list: "bullet" }],
                                        ["blockquote", "code-block"],
                                        ["link"],
                                        ["clean"],
                                    ],
                                }}
                            />
                        )}
                    />
                    {errors.content && (
                        <p className="text-red-500 text-sm">{errors.content.message}</p>
                    )}
                </div>


                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Add to collection(optional)
                    </label>

                    <Controller
                        name="collectionId"
                        control={control}
                        render={({ field }) => (

                            <Select
                                onValueChange={(value) => {
                                    if (value === 'new') {
                                        setIsCollectionDialogOpen(true)
                                    } else {
                                        field.onChange(value)
                                    }

                                }}

                                value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="choose a collection.." />
                                </SelectTrigger>
                                <SelectContent>
                                    {collectionResult?.map((collection) => {
                                        return (
                                            <SelectItem key={collection.id} value={collection.id}>
                                                {collection.name}
                                            </SelectItem>
                                        )

                                    })}

                                    <SelectItem value="new">
                                        <span className='text-orange-600'>
                                            + Create new collection
                                        </span>
                                    </SelectItem>

                                </SelectContent>
                            </Select>
                        )}
                    />

                    {errors.collectionId && (
                        <p className="text-red-500 text-sm">{errors.collectionId.message}</p>
                    )}
                </div>


                <div className='space-x-4 flex'>
                    {!isEditMode && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleSaveDraft}
                            disabled={isLoading || !isDirty}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save as Draft
                        </Button>
                    )}

                    <Button type="submit" variant="journal" disabled={actionLoading}>
                        {isEditMode ? "Update" : "Publish"}
                    </Button>

                    {isEditMode && (
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                router.push(`/journal/${entryResult?.id}`);
                            }}
                            variant="destructive"
                        >
                            Cancel
                        </Button>
                    )}

                </div>
            </form>
            <CollectionForm
                loading={createCollectionLoading}
                onSuccess={handleCreateCollection}
                open={isCollectionDialogOpen}
                setOpen={setIsCollectionDialogOpen}
            />
        </div>
    )
}

export default JournalWrite