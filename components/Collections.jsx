"use client"
import React, { useEffect, useState } from 'react'
import CollectionPreview from './CollectionPreview';
import CollectionForm from './CollectionForm';
import useFetch from '@/hooks/use-fetch';
import { createCollection } from '@/actions/collection';
import { BarLoader } from 'react-spinners';

const Collections = ({ collections = [], entriesByCollection }) => {
    const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);


    const {
        loading: createCollectionLoading,
        fn: createCollectionFn,
        data: createCollectionResult,
    } = useFetch(createCollection);

    useEffect(() => {
        if (createCollectionResult) {
            setIsCollectionDialogOpen(false);

            toast.success(`Collection ${createCollectionResult.name} created!`);
        }

        
    }, [createCollectionResult, createCollectionLoading]);

    const handleCreateCollection = async (data) => {
        createCollectionFn(data);
    };
    if(createCollectionResult){
        <BarLoader className="mb-4" width={"100%"} color="orange" />
    }
    if (collections.length === 0) return <></>;
    return (
        <section id="collections" className="space-y-6">
            <h2 className="text-3xl font-bold gradient-title">Collections</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <CollectionPreview
                    isCreateNew={true}
                    onCreateNew={() => setIsCollectionDialogOpen(true)}
                />

                {entriesByCollection?.unorganized?.length > 0 && (
                    <CollectionPreview
                        name="Unorganized"
                        entries={entriesByCollection.unorganized}
                        isUnorganized={true}
                    />
                )}

                {collections?.map((collection) => (
                  
                    
                    <CollectionPreview
                        key={collection.id}
                        id={collection.id}
                        name={collection.name}
                        entries={entriesByCollection[collection.id] || []}
                    />
                ))}

                <CollectionForm
                    loading={createCollectionLoading}
                    onSuccess={handleCreateCollection}
                    open={isCollectionDialogOpen}
                    setOpen={setIsCollectionDialogOpen}
                />
            </div>



        </section >
    )
}

export default Collections