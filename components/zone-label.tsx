import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Zone } from "@/app/page"

type ZoneLabelProps = {
  zone: Zone
  hourHeight: number
}

export default function ZoneLabel({ zone, hourHeight }: ZoneLabelProps) {
  const top = zone.start * hourHeight
  const height = (zone.end - zone.start) * hourHeight

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "absolute w-full flex items-center justify-center cursor-pointer group transition-colors border-b",
            zone.partitionColor,
            zone.borderColor,
          )}
          style={{ top: `${top}px`, height: `${height}px` }}
        >
          <div className="flex flex-col items-center justify-center h-full gap-2 py-2">
            <div className={cn("transition-transform group-hover:scale-110", zone.textColor)}>{zone.icon}</div>
            <div className="flex-1 relative w-full">
              <p
                className={cn(
                  "absolute inset-0 flex items-center justify-center text-sm font-semibold transition-colors group-hover:text-black",
                  zone.textColor,
                )}
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  whiteSpace: "nowrap",
                }}
              >
                {zone.name}
              </p>
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-60 ml-2">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{zone.name}</h4>
            <p className="text-sm text-muted-foreground">{zone.description}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
