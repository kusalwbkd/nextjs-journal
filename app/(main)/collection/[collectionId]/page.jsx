
import { getCollection } from '@/actions/collection';
import { getJournalEntries } from '@/actions/journal';
import DeleteCollectionBtn from '@/components/DeleteCollectionBtn';
import JournalFilters from '@/components/JournalFilters';
import React from 'react'

const CollectionPage = async({ params }) => {
    const { collectionId } =  await params;
    const collectionResult=await getCollection(collectionId)
    const entries=await getJournalEntries({collectionId})

  return (
    <div className='space-y-6'>
        <div className='flex flex-col justify-between'>
            <div className='flex justify-between'>
                <h1 className=' text-4xl font-bold gradient-title'>
                    {collectionId==='unorganized' ? "Unorganized Entries":collectionResult?.name||"Collection"}

                </h1>
                {collectionResult && <DeleteCollectionBtn
                 collectionResult={collectionResult}
                 entriesCount={entries?.data?.entries?.length}
                />}
            </div>

            {collectionResult?.description && (
                <h2 className='font-extralight pl-1'>{collectionResult?.description}</h2>
            )}
        </div>
        <JournalFilters entries={entries?.data?.entries}/>
    </div>
  )
}

export default CollectionPage