"use client"

import * as React from "react"
import { CalendarClock, Inbox } from "lucide-react"

import { ChannelIcon, StatusBadge } from "@/components/content-badges"
import { useContent } from "@/components/content-store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MEMBERS, type Post } from "@/lib/content"
import { formatTime, relativeDayLabel, startOfDay } from "@/lib/date"

function UpcomingRow({
  post,
  now,
  onOpen,
}: {
  post: Post
  now: Date
  onOpen: (id: string) => void
}) {
  const date = new Date(post.scheduledFor)
  const relative = relativeDayLabel(date, now)

  return (
    <button
      type="button"
      onClick={() => onOpen(post.id)}
      className="hover:bg-accent/60 focus-visible:ring-ring/50 flex w-full items-start gap-2.5 rounded-lg p-2 text-left transition-colors focus-visible:ring-3 focus-visible:outline-none"
    >
      <ChannelIcon channel={post.channel} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] leading-tight font-medium">{post.title}</p>
        <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px]">
          <span className="tabular-nums">{formatTime(date)}</span>
          {relative ? (
            <>
              <span aria-hidden>·</span>
              <span className="text-primary font-medium">{relative}</span>
            </>
          ) : null}
          <StatusBadge status={post.status} className="h-4 text-[10px]" />
        </div>
      </div>
      <Avatar className="mt-0.5 size-5 rounded-full">
        <AvatarFallback className="text-[9px]">
          {MEMBERS.find((member) => member.id === post.authorId)?.initials ?? "?"}
        </AvatarFallback>
      </Avatar>
    </button>
  )
}

export function UpcomingPanel({ onOpenPost }: { onOpenPost: (id: string) => void }) {
  const { posts, now } = useContent()

  const upcoming = React.useMemo(
    () =>
      posts
        .filter((post) => startOfDay(new Date(post.scheduledFor)).getTime() >= startOfDay(now).getTime())
        .sort(
          (a, b) =>
            new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime(),
        ),
    [posts, now],
  )

  const needsReview = posts.filter((post) => post.status === "in_review").length

  return (
    <section className="bg-card flex flex-col rounded-xl border">
      <header className="flex items-center gap-2 border-b px-4 py-3">
        <CalendarClock className="text-muted-foreground size-4" />
        <h2 className="text-sm font-semibold">Upcoming posts</h2>
        <span className="text-muted-foreground ml-auto text-xs tabular-nums">
          {upcoming.length}
        </span>
      </header>

      <ScrollArea className="max-h-[26rem] min-h-0 flex-1">
        <div className="flex flex-col gap-0.5 p-2">
          {upcoming.length ? (
            upcoming.slice(0, 12).map((post) => (
              <UpcomingRow
                key={post.id}
                post={post}
                now={now}
                onOpen={onOpenPost}
              />
            ))
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <Inbox className="text-muted-foreground size-6" />
              <p className="text-muted-foreground text-xs">
                No upcoming posts.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {needsReview ? (
        <footer className="border-t px-4 py-3">
          <Button variant="outline" size="sm" className="w-full">
            Review {needsReview} in review
          </Button>
        </footer>
      ) : null}
    </section>
  )
}
