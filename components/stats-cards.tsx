"use client"

import * as React from "react"
import { CalendarClock, CircleCheckBig, Clock, Megaphone, TrendingUp, type LucideIcon } from "lucide-react"

import { useContent } from "@/components/content-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CHANNELS, type Post } from "@/lib/content"
import { addDays, isSameDay, startOfWeek } from "@/lib/date"

type Metric = {
  label: string
  value: number
  hint: string
  icon: LucideIcon
  trend?: string
}

function countIn(post: Post, from: Date, to: Date, status: Post["status"]) {
  const date = new Date(post.scheduledFor)
  return (
    post.status === status &&
    date.getTime() >= from.getTime() &&
    date.getTime() < to.getTime()
  )
}

export function StatsCards() {
  const { posts, now } = useContent()

  const metrics = React.useMemo<Metric[]>(() => {
    const monday = startOfWeek(now)
    const nextMonday = addDays(monday, 7)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    const thisWeek = posts.filter((post) =>
      countIn(post, monday, nextMonday, "scheduled"),
    ).length
    const publishedThisMonth = posts.filter((post) =>
      countIn(post, monthStart, monthEnd, "published"),
    ).length
    const inReview = posts.filter((post) => post.status === "in_review").length
    const drafts = posts.filter((post) => post.status === "draft").length
    const activeChannels = new Set(posts.map((post) => post.channel)).size

    return [
      {
        label: "Scheduled this week",
        value: thisWeek,
        hint: `${posts.filter((post) => isSameDay(new Date(post.scheduledFor), now)).length} today`,
        icon: CalendarClock,
      },
      {
        label: "Published this month",
        value: publishedThisMonth,
        hint: "Monthly goal 24",
        icon: CircleCheckBig,
        trend: "+12%",
      },
      {
        label: "In review",
        value: inReview,
        hint: `${drafts} drafts`,
        icon: Clock,
      },
      {
        label: "Active channels",
        value: activeChannels,
        hint: `of ${CHANNELS.length} connected`,
        icon: Megaphone,
      },
    ]
  }, [posts, now])

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-1">
            <CardTitle className="text-muted-foreground text-xs font-medium">
              {metric.label}
            </CardTitle>
            <metric.icon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums">
                {metric.value}
              </span>
              {metric.trend ? (
                <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-0.5 text-xs font-medium">
                  <TrendingUp className="size-3" />
                  {metric.trend}
                </span>
              ) : null}
            </div>
            <p className="text-muted-foreground mt-0.5 text-xs">{metric.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
