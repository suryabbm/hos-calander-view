import type { Event, LaidOutEvent } from "@/app/page"

const MIN_EVENT_DURATION = 0.5 // 30 minutes

export function calculateEventLayout(events: Event[]): LaidOutEvent[] {
  if (events.length === 0) return []

  // Pre-process events to enforce minimum duration for layout purposes
  const processedEvents = events.map((event) => {
    const duration = event.end - event.start
    const visualEnd = duration < MIN_EVENT_DURATION ? event.start + MIN_EVENT_DURATION : event.end
    return { ...event, visualEnd }
  })

  const sortedEvents = processedEvents.sort((a, b) => a.start - b.start || b.visualEnd - a.visualEnd)

  const laidOutEvents: LaidOutEvent[] = []

  for (const event of sortedEvents) {
    let col = 0
    while (true) {
      let isBlocked = false
      for (const placedEvent of laidOutEvents) {
        // Check if the current column is taken by an overlapping event
        if (placedEvent.col === col && event.start < placedEvent.visualEnd && event.visualEnd > placedEvent.start) {
          isBlocked = true
          break
        }
      }
      if (isBlocked) {
        col++
      } else {
        break
      }
    }
    laidOutEvents.push({ ...event, col, totalCols: 1, zIndex: col + 1 })
  }

  // Now determine totalCols for each event
  for (const event of laidOutEvents) {
    let maxCols = 1
    for (const otherEvent of laidOutEvents) {
      if (event.start < otherEvent.visualEnd && event.visualEnd > otherEvent.start) {
        maxCols = Math.max(maxCols, otherEvent.col + 1)
      }
    }
    event.totalCols = maxCols
  }

  return laidOutEvents
}
