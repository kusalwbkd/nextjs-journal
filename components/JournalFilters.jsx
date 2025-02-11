"use client"

import React, { useEffect, useState } from 'react'
import { Input } from './ui/input';
import { Calendar1Icon, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MOODS } from '@/app/lib/moods';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';
import EntryCard from './EntryCard';

const JournalFilters = ({ entries }) => {

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMood, setSelectedMood] = useState("");
    const [date, setDate] = useState(null);
    const [filteredEntries, setFilteredEntries] = useState(entries);
    // console.log("entries are",entries);

    useEffect(() => {

        let filtered = [...entries];
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((item) => item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query))
        }
        if (selectedMood) {
            filtered = filtered.filter((item) => item.mood === selectedMood)
        }
        if (date) {
            filtered = filtered.filter((item) =>
                isSameDay(new Date(item.createdAt), date)
            );
        }
        setFilteredEntries(filtered)

    }, [searchQuery, selectedMood, date, entries])

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedMood("");
        setDate(null);
    };

    return (
        <>
            <div className='flex flex-wrap gap-4'>
                <div className='flex-1 min-w-[200px]'>
                    <Input
                        placeholder="Search Entries...."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-full'
                        prefix={<Search className='w-4 h-4 text-gray-400' />}
                    />

                </div>

                <Select value={selectedMood} onValueChange={setSelectedMood}>
                    <SelectTrigger className={"w-[150px]"}>
                        <SelectValue placeholder="Filter by mode" />
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

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn("justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <Calendar1Icon className='h-4 2-4' />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                {(searchQuery || selectedMood || date) && (
                    <Button
                        variant="ghost"
                        onClick={clearFilters}
                        className="text-orange-600"
                    >
                        Clear Filters
                    </Button>
                )}

            </div>

            <div className="text-sm text-gray-500">
                Showing {filteredEntries.length} of {entries.length} entries
            </div>


            {filteredEntries.length === 0 ? (
                <div className="text-center p-8">
                    <p className="text-gray-500">No entries found</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredEntries.map((entry) => (
                        <EntryCard key={entry.id} entry={entry} />
                    ))}
                </div>
            )}
        </>
    )
}

export default JournalFilters