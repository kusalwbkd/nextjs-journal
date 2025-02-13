"use client"

import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { getAnalytics } from '@/actions/analytics';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/nextjs';
import { BarLoader } from 'react-spinners';
import { Card, CardContent, CardHeader } from './ui/card';


const timeOptions = [
  { value: "7d", label: "Last 7 Days" },
  { value: "15d", label: "Last 15 Days" },
  { value: "30d", label: "Last 30 Days" },
];
const MoodAnalytics = () => {
  const [period, setPeriod] = useState("7d");
  const {
    loading,
    data: analytics,
    fn: fetchAnalytics,
  } = useFetch(getAnalytics);

  const { isLoaded } = useUser();


  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  if (isLoaded || loading) {
    return <BarLoader color="orange" width={"100%"} />
  }

  if (!analytics) return null;

  const { timeline, stats } = analytics.data;
  

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-5xl font-bold gradient-title">Dashboard</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((option) => {
              return (
                <SelectItem value={option.value} key={option.value}>
                  {option.value}
                </SelectItem>
              )
            })}


          </SelectContent>
        </Select>

      </div>
      
      <div>
        <div>
        <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEntries}</div>
                <p className="text-xs text-muted-foreground">
                  ~{stats.dailyAverage} entries per day
                </p>
              </CardContent>
            </Card>
        </div>
      </div>


    </>

  )
}

export default MoodAnalytics