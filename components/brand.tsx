import Image from "next/image"

import { cn } from "@/lib/utils"

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "bg-brand flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg",
        className,
      )}
    >
      <Image
        src="/bricks-logo.webp"
        alt=""
        width={32}
        height={32}
        className="size-full"
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
    <div className={cn("flex items-center gap-2", className)}>
      <BrandMark />
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
