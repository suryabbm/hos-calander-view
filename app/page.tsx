"use client"

import { useState, useCallback, useMemo } from "react"
import { Plus, Zap, Coffee, Moon, Sunrise } from "lucide-react"
import { Button } from "@/components/ui/button"
import CalendarHeader from "@/components/calendar-header"
import ZoneLabel from "@/components/zone-label"
import EventCard from "@/components/event-card"
import { calculateEventLayout } from "@/lib/layout-helper"
import type { ReactNode } from "react"

export type Event = {
  id: number
  title: string
  start: number // e.g., 9.5 for 9:30 AM
  end: number
  color: string
  items?: string[]
  calories?: number
}

export type LaidOutEvent = Event & {
  col: number
  totalCols: number
  zIndex: number
  visualEnd: number
}

export type Zone = {
  name: string
  start: number
  end: number
  color: string
  partitionColor: string
  borderColor: string
  textColor: string
  icon: ReactNode
  description: string
}

const energyZones: Zone[] = [
  {
    name: "Warm-up",
    start: 8,
    end: 11,
    color: "bg-orange-500/10",
    partitionColor: "bg-orange-100",
    borderColor: "border-orange-200",
    textColor: "text-orange-600",
    icon: <Sunrise className="h-5 w-5" />,
    description: "Your body is naturally warming up. Great for light activity and planning your day.",
  },
  {
    name: "Focus",
    start: 11,
    end: 14,
    color: "bg-sky-500/10",
    partitionColor: "bg-sky-100",
    borderColor: "border-sky-200",
    textColor: "text-sky-600",
    icon: <Coffee className="h-5 w-5" />,
    description: "Peak cognitive performance. Ideal for tasks that require deep concentration and analysis.",
  },
  {
    name: "Energy Calm",
    start: 14,
    end: 17,
    color: "bg-purple-500/10",
    partitionColor: "bg-purple-100",
    borderColor: "border-purple-200",
    textColor: "text-purple-600",
    icon: <Moon className="h-5 w-5" />,
    description: "A natural dip in energy. Perfect for creative work, brainstorming, and collaboration.",
  },
  {
    name: "Energy Peak",
    start: 17,
    end: 21,
    color: "bg-green-500/10",
    partitionColor: "bg-green-100",
    borderColor: "border-green-200",
    textColor: "text-green-600",
    icon: <Zap className="h-5 w-5" />,
    description: "A second wind of physical energy. Excellent for workouts and physical activities.",
  },
]

const eventsData: Event[] = [
  // Meals
  {
    id: 1,
    title: "Breakfast",
    start: 8.5,
    end: 9,
    color: "bg-amber-500",
    items: ["Oatmeal", "Berries", "Nuts"],
    calories: 450,
  },
  {
    id: 7,
    title: "Lunch",
    start: 12.75,
    end: 13.5,
    color: "bg-lime-600",
    items: ["Grilled Chicken Salad"],
    calories: 550,
  },
  {
    id: 11,
    title: "Dinner",
    start: 18,
    end: 18.75,
    color: "bg-sky-600",
    items: ["Salmon", "Quinoa", "Asparagus"],
    calories: 700,
  },
  // Other Events
  { id: 2, title: "Team Standup", start: 9, end: 9.5, color: "bg-blue-500" }, // 30 min event
  { id: 3, title: "Review Daily Goals", start: 9.5, end: 9.75, color: "bg-teal-500" }, // 15 min event
  { id: 4, title: "Answer Priority Emails", start: 10, end: 11, color: "bg-cyan-500" },
  { id: 5, title: "Deep Work: Project A", start: 11, end: 12.75, color: "bg-indigo-500" },
  { id: 6, title: "Design Review", start: 11.5, end: 12.5, color: "bg-violet-500" },
  { id: 8, title: "Client Call", start: 14, end: 15, color: "bg-rose-500" },
  { id: 9, title: "Plan Tomorrow's Tasks", start: 15.5, end: 16, color: "bg-fuchsia-500" }, // 30 min event
  { id: 12, title: "Personal Project Time", start: 19, end: 20, color: "bg-red-500" },
]

const HOUR_HEIGHT = 96

export default function EnergyCalendar() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay())
  const [checkInMode, setCheckInMode] = useState(false)
  const [completedEvents, setCompletedEvents] = useState<Set<number>>(new Set())

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const laidOutEvents = useMemo(() => calculateEventLayout(eventsData), [])

  const handleToggleComplete = useCallback((eventId: number) => {
    setCompletedEvents((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
      return newSet
    })
  }, [])

  const handleCompleteAll = useCallback(() => {
    setCompletedEvents(new Set(eventsData.map((e) => e.id)))
  }, [])

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="w-full max-w-md mx-auto bg-white shadow-lg flex flex-col h-screen">
        <CalendarHeader
          selectedDay={selectedDay}
          onSelectedDayChange={setSelectedDay}
          checkInMode={checkInMode}
          onCheckInModeToggle={() => setCheckInMode(!checkInMode)}
          onCompleteAll={handleCompleteAll}
        />

        <main className="flex-1 flex overflow-y-auto">
          {/* Time Gutter */}
          <div className="w-12 text-center text-xs text-slate-400 pt-2 flex-shrink-0">
            <div className="relative" style={{ height: `${24 * HOUR_HEIGHT}px` }}>
              {hours.map((hour) => (
                <div key={hour} className="h-[96px] -translate-y-2">
                  {hour > 0 && <span>{hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Main timeline content */}
          <div className="flex-1 flex">
            {/* Zone Gutter */}
            <div className="w-14 border-r border-l border-slate-100 flex-shrink-0">
              <div className="relative" style={{ height: `${24 * HOUR_HEIGHT}px` }}>
                {energyZones.map((zone) => (
                  <ZoneLabel key={zone.name} zone={zone} hourHeight={HOUR_HEIGHT} />
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="flex-1 relative">
              <div className="relative" style={{ height: `${24 * HOUR_HEIGHT}px` }}>
                {/* Grid lines and Zone backgrounds */}
                {hours.map((hour) => (
                  <div key={hour} className="h-[96px] border-t border-slate-100" />
                ))}
                {energyZones.map((zone) => (
                  <div
                    key={zone.name}
                    className={`absolute w-full ${zone.color}`}
                    style={{
                      top: `${zone.start * HOUR_HEIGHT}px`,
                      height: `${(zone.end - zone.start) * HOUR_HEIGHT}px`,
                    }}
                  />
                ))}

                {/* Events */}
                {laidOutEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isCompleted={completedEvents.has(event.id)}
                    onToggleComplete={handleToggleComplete}
                    checkInMode={checkInMode}
                    hourHeight={HOUR_HEIGHT}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>

        <Button className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-30" size="icon">
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add Event</span>
        </Button>
      </div>
    </div>
  )
}
