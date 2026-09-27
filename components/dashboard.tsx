"use client"

import * as React from "react"

import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { ContentProvider, useContent } from "@/components/content-store"
import { PostSheet } from "@/components/post-sheet"
import { ScheduleImportDialog } from "@/components/schedule-import-dialog"
import { StatsCards } from "@/components/stats-cards"
import { UpcomingPanel } from "@/components/upcoming-panel"
import { WeekCalendar } from "@/components/week-calendar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { atTime, startOfWeek } from "@/lib/date"
import type { Post } from "@/lib/content"

function DashboardView() {
  const { now, getPost } = useContent()
  const [weekStart, setWeekStart] = React.useState(() => startOfWeek(now))
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [importOpen, setImportOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Post | null>(null)
  const [fallbackDate, setFallbackDate] = React.useState(() => atTime(now, 9))
  const [formKey, setFormKey] = React.useState(0)

  function openPost(post: Post) {
    setEditing(post)
    setFallbackDate(new Date(post.scheduledFor))
    setFormKey((key) => key + 1)
    setSheetOpen(true)
  }

  function openCreate(date?: Date) {
    setEditing(null)
    setFallbackDate(date ?? atTime(now, 9))
    setFormKey((key) => key + 1)
    setSheetOpen(true)
  }

  function handleOpenPost(id: string) {
    const post = getPost(id)
    if (post) openPost(post)
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <AppHeader
          onCreate={() => openCreate()}
          onImport={() => setImportOpen(true)}
        />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <StatsCards />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <WeekCalendar
              weekStart={weekStart}
              onWeekChange={setWeekStart}
              onOpenPost={handleOpenPost}
              onCreateAt={(date) => openCreate(date)}
            />
            <UpcomingPanel onOpenPost={handleOpenPost} />
          </div>
        </div>
      </SidebarInset>

      <PostSheet
        open={sheetOpen}
        post={editing}
        fallbackDate={fallbackDate}
        formKey={formKey}
        onOpenChange={setSheetOpen}
      />

      <ScheduleImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </>
  )
}

export function Dashboard({ now }: { now: number }) {
  return (
    <SidebarProvider>
      <ContentProvider now={now}>
        <DashboardView />
      </ContentProvider>
    </SidebarProvider>
  )
}
