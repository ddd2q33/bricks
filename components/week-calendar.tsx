"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

import { ChannelIcon, StatusBadge } from "@/components/content-badges"
import { useContent } from "@/components/content-store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  addDays,
  dateKey,
  formatDayHeader,
  formatTime,
  formatWeekRange,
  isSameDay,
  startOfDay,
  startOfWeek,
} from "@/lib/date"
import { MEMBERS, type Post } from "@/lib/content"

function PostCard({
  post,
  onOpen,
}: {
  post: Post
  onOpen: (id: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(post.id)}
      className="group/post bg-card hover:bg-accent/60 focus-visible:ring-ring/50 w-full rounded-lg border p-2 text-left transition-colors focus-visible:ring-3 focus-visible:outline-none"
    >
      <div className="flex items-start gap-1.5">
        <ChannelIcon channel={post.channel} className="size-5 rounded-[5px]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] leading-tight font-medium">
            {post.title}
          </p>
          <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-[11px] leading-tight">
            <span className="tabular-nums">{formatTime(new Date(post.scheduledFor))}</span>
            <span aria-hidden>·</span>
            <span className="truncate">{post.channel}</span>
          </p>
        </div>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <StatusBadge status={post.status} className="h-4 text-[10px]" />
        <Avatar className="ml-auto size-4 rounded-full">
          <AvatarFallback className="text-[8px]">
            {MEMBERS.find((member) => member.id === post.authorId)?.initials ?? "?"}
          </AvatarFallback>
        </Avatar>
      </div>
    </button>
  )
}

export function WeekCalendar({
  weekStart,
  onWeekChange,
  onOpenPost,
  onCreateAt,
}: {
  weekStart: Date
  onWeekChange: (monday: Date) => void
  onOpenPost: (id: string) => void
  onCreateAt: (date: Date) => void
}) {
  const { visiblePosts, now } = useContent()

  const days = React.useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
    [weekStart],
  )

  const byDay = React.useMemo(() => {
    const map = new Map<string, Post[]>()
    for (const post of visiblePosts) {
      const key = dateKey(new Date(post.scheduledFor))
      const bucket = map.get(key)
      if (bucket) bucket.push(post)
      else map.set(key, [post])
    }
    for (const bucket of map.values()) {
      bucket.sort(
        (a, b) =>
          new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime(),
      )
    }
    return map
  }, [visiblePosts])

  const today = startOfDay(now)

  return (
    <section className="bg-card flex min-h-[34rem] flex-col rounded-xl border">
      <header className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">Post calendar</h2>
          <p className="text-muted-foreground text-xs" suppressHydrationWarning>
            {formatWeekRange(weekStart)}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekChange(startOfWeek(new Date(now)))}
          >
            This week
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous week"
            onClick={() => onWeekChange(addDays(weekStart, -7))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next week"
            onClick={() => onWeekChange(addDays(weekStart, 7))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {days.map((day) => {
          const key = dateKey(day)
          const dayPosts = byDay.get(key) ?? []
          const isToday = isSameDay(day, today)

          return (
            <div
              key={key}
              className={cn(
                "group/day bg-card flex min-h-40 flex-col gap-1.5 p-2",
                isToday && "bg-accent/30",
              )}
            >
              <div className="flex items-center justify-between px-1 pt-1 pb-0.5">
                <span
                  className={cn(
                    "text-muted-foreground text-[11px] font-medium tracking-wide uppercase",
                    isToday && "text-primary",
                  )}
                >
                  {formatDayHeader(day)}
                </span>
                {dayPosts.length ? (
                  <span className="text-muted-foreground text-[10px] tabular-nums">
                    {dayPosts.length}
                  </span>
                ) : null}
              </div>

              {dayPosts.map((post) => (
                <PostCard key={post.id} post={post} onOpen={onOpenPost} />
              ))}

              <button
                type="button"
                onClick={() => onCreateAt(day)}
                className="text-muted-foreground/70 hover:text-foreground hover:bg-accent mt-auto flex items-center gap-1 rounded-md px-1.5 py-1.5 text-left text-[11px] transition-colors"
              >
                <Plus className="size-3" />
                Add
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
