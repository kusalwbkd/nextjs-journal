
"use client"
import { getCollections } from '@/actions/collection';
import { getJournalEntries } from '@/actions/journal';
import Collections from '@/components/Collections';
import MoodAnalytics from '@/components/MoodAnalytics';
import useFetch from '@/hooks/use-fetch';
import React, { useEffect } from 'react'

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

  return (
    <div className="px-4 py-8 space-y-8">

      <section className="space-y-4">
     {/*    <MoodAnalytics /> */}
      </section>

      <Collections
        collections={collectionResult}
        entriesByCollection={entriesByCollection}
      />
    </div>
  )
}

export default Dashboard