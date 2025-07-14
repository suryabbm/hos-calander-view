import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { LaidOutEvent } from "@/app/page"
import { Flame } from "lucide-react"

type EventCardProps = {
  event: LaidOutEvent
  isCompleted: boolean
  onToggleComplete: (id: number) => void
  checkInMode: boolean
  hourHeight: number
}

const MIN_HEIGHT_FOR_VERTICAL_LAYOUT = 64 // ~40 minutes
const MIN_HEIGHT_FOR_HORIZONTAL_LAYOUT = 48 // ~30 minutes

export default function EventCard({ event, isCompleted, onToggleComplete, checkInMode, hourHeight }: EventCardProps) {
  const top = event.start * hourHeight
  const height = (event.visualEnd - event.start) * hourHeight - 4 // Use visualEnd for height

  const width = `calc(${100 / event.totalCols}% - 4px)`
  const left = `calc(${event.col * (100 / event.totalCols)}%)`

  const isMeal = event.items && event.items.length > 0

  const getLayoutType = () => {
    if (height >= MIN_HEIGHT_FOR_VERTICAL_LAYOUT) return "vertical"
    if (height >= MIN_HEIGHT_FOR_HORIZONTAL_LAYOUT) return "horizontal"
    return "compact" // For the shortest events
  }

  const layoutType = getLayoutType()

  const formatTime = (time: number) => {
    return new Date(0, 0, 0, Math.floor(time), (time % 1) * 60).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div
      className={cn(
        "absolute rounded-lg text-white p-2 shadow-md transition-all duration-300 ease-in-out flex items-start",
        event.color,
        isCompleted && "opacity-50",
      )}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        left: left,
        width: width,
        zIndex: event.zIndex,
      }}
    >
      {checkInMode && (
        <div className="flex items-center h-full mr-2">
          <Checkbox
            id={`event-${event.id}`}
            checked={isCompleted}
            onCheckedChange={() => onToggleComplete(event.id)}
            className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
          />
        </div>
      )}
      <div className="flex-1 overflow-hidden h-full">
        {layoutType === "vertical" && isMeal ? (
          // NEW VERTICAL MEAL LAYOUT
          <div className="flex justify-between items-start h-full w-full">
            <div className="flex flex-col">
              <p className={cn("font-bold text-sm", isCompleted && "line-through")}>{event.title}</p>
              <div className="text-xs opacity-90 mt-1 flex items-center">
                <span className="truncate">{event.items![0]}</span>
                {event.items!.length > 1 && (
                  <span className="ml-1.5 font-bold text-white/90 bg-black/20 px-1.5 py-0.5 rounded-full text-[10px] flex-shrink-0">
                    +{event.items!.length - 1}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end text-right flex-shrink-0">
              {event.calories && (
                <div className="flex items-center gap-1 font-semibold text-sm">
                  <Flame className="h-3.5 w-3.5" />
                  <span>{event.calories} kcal</span>
                </div>
              )}
              <p className="text-xs opacity-80 mt-1">{formatTime(event.start)}</p>
            </div>
          </div>
        ) : layoutType === "vertical" && !isMeal ? (
          // Original Vertical Layout for non-meals
          <div className="flex flex-col h-full">
            <p className={cn("font-bold text-sm truncate", isCompleted && "line-through")}>{event.title}</p>
            <p className="text-xs opacity-80">{formatTime(event.start)}</p>
          </div>
        ) : layoutType === "horizontal" ? (
          // HORIZONTAL LAYOUT
          <div className="flex items-center justify-between h-full gap-2">
            <p className={cn("font-bold text-sm truncate", isCompleted && "line-through")}>{event.title}</p>
            <div className="flex-shrink-0 text-xs opacity-80">{formatTime(event.start)}</div>
          </div>
        ) : (
          // COMPACT LAYOUT
          <div className="flex items-center h-full">
            <p className={cn("font-bold text-sm truncate", isCompleted && "line-through")}>{event.title}</p>
          </div>
        )}
      </div>
    </div>
  )
}
