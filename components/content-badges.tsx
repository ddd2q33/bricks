import { Badge } from "@/components/ui/badge"
import { CHANNEL_META, STATUS_META, type Channel, type PostStatus } from "@/lib/content"
import { cn } from "@/lib/utils"

export function StatusBadge({
  status,
  className,
}: {
  status: PostStatus
  className?: string
}) {
  const meta = STATUS_META[status]

  return (
    <Badge variant="secondary" className={cn("px-1.5", meta.className, className)}>
      {meta.label}
    </Badge>
  )
}

export function ChannelIcon({
  channel,
  className,
}: {
  channel: Channel
  className?: string
}) {
  const meta = CHANNEL_META[channel]
  const Icon = meta.icon

  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-md",
        meta.className,
        className,
      )}
    >
      <Icon className="size-3.5" />
      <span className="sr-only">{meta.label}</span>
    </span>
  )
}

export function ChannelLabel({ channel }: { channel: Channel }) {
  return <span className="truncate">{CHANNEL_META[channel].label}</span>
}
