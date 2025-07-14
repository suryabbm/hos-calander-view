"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const today = new Date()
const todayIndex = today.getDay()

type CalendarHeaderProps = {
  selectedDay: number
  onSelectedDayChange: (day: number) => void
  checkInMode: boolean
  onCheckInModeToggle: () => void
  onCompleteAll: () => void
}

export default function CalendarHeader({
  selectedDay,
  onSelectedDayChange,
  checkInMode,
  onCheckInModeToggle,
  onCompleteAll,
}: CalendarHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-20 border-b border-slate-200">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-slate-800">Today</h1>
          <span className="text-sm font-medium text-slate-500">
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {checkInMode && (
            <Button variant="outline" size="sm" onClick={onCompleteAll}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Complete All
            </Button>
          )}
          <Button variant={checkInMode ? "default" : "outline"} size="sm" onClick={onCheckInModeToggle}>
            <Check className="h-4 w-4 mr-2" />
            {checkInMode ? "Done" : "Check In"}
          </Button>
        </div>
      </div>
      <div className="flex justify-around pb-2 px-2">
        {days.map((day, index) => (
          <div key={day} className="text-center">
            <span className="text-xs text-slate-500">{day}</span>
            <Button
              variant={selectedDay === index ? "secondary" : "ghost"}
              size="icon"
              className={cn(
                "w-10 h-10 rounded-full",
                todayIndex === index && selectedDay !== index && "bg-blue-100 text-blue-700",
              )}
              onClick={() => onSelectedDayChange(index)}
            >
              {today.getDate() - todayIndex + index}
            </Button>
          </div>
        ))}
      </div>
    </header>
  )
}
