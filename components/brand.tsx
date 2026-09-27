import Image from "next/image"

import { cn } from "@/lib/utils"

const LOGO_SRC = "/logo.webp"
const LOGO_WIDTH = 512
const LOGO_HEIGHT = 399

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "bg-white flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg",
        className,
      )}
    >
      <Image
        src={LOGO_SRC}
        alt=""
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className="size-full object-contain"
        priority
      />
    </span>
  )
}

export function Brand({
  className,
  subtitle = true,
}: {
  className?: string
  subtitle?: boolean
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <BrandMark className="size-9" />
      <span className="grid min-w-0 leading-tight">
        <span className="truncate text-sm font-semibold">Bricks</span>
        {subtitle ? (
          <span className="text-muted-foreground truncate text-xs">
            Content Scheduler
          </span>
        ) : null}
      </span>
    </div>
  )
}
