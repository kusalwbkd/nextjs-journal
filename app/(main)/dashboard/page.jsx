
"use client"
import { getCollections } from '@/actions/collection';
import { getJournalEntries } from '@/actions/journal';
import Collections from '@/components/Collections';
import MoodAnalytics from '@/components/MoodAnalytics';
import useFetch from '@/hooks/use-fetch';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';

const Dashboard = () => {
  const {
    loading: collectionLoading,
    fn: collectionFn,
    data: collectionResult,
  } = useFetch(getCollections);

  const {
    loading: JournalLoading,
    fn: JournalonFn,
    data: JournalonResult,
  } = useFetch(getJournalEntries);

  const loading = collectionLoading || JournalLoading
  useEffect(() => {
    JournalonFn()
    collectionFn()
  }, [])

   
  const entriesByCollection = JournalonResult?.data?.entries.reduce((acc, curr) => {
    const collectionId = curr.collectionId || "unorganized";
    if (!acc[collectionId]) {
      acc[collectionId] = [];
    }
    acc[collectionId].push(curr);
    return acc;
  }, {})

  if (loading) {

    return(
        <BarLoader className="mb-4" width={"100%"} color="orange" />
    )
}

if (collectionResult?.length === 0||JournalLoading?.length===0) {
    return (
        <p className="text-lg md:text-xl text-orange-800 mb-8 text-center">
            Please write some!!!
        </p>
    )
}

  return (
    <div className="px-4 py-8 space-y-8">

      <section className="space-y-4">
        {/* <MoodAnalytics />  */}
      </section>

      <Collections
        collections={collectionResult}
        entriesByCollection={entriesByCollection}
      />
    </div>
  )
}

export default Dashboard