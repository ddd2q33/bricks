"use client"

import { Bell, Plus, Search, X } from "lucide-react"

import { Brand } from "@/components/brand"
import { useContent } from "@/components/content-store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CHANNELS, CHANNEL_META, MEMBERS, POST_STATUSES, STATUS_META } from "@/lib/content"

export function AppHeader({ onCreate }: { onCreate: () => void }) {
  const { query, setQuery, status, setStatus, channel, setChannel } = useContent()

  return (
    <header className="bg-background sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b px-4 md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Brand className="mr-2 hidden md:flex" />
      <div className="relative max-w-sm flex-1">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search posts..."
          className="h-9 pr-8 pl-8"
        />
        {query ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setQuery("")}
            className="absolute top-1/2 right-1 -translate-y-1/2"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as typeof status)}
        >
          <SelectTrigger className="hidden h-9 w-[9.5rem] sm:flex">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {POST_STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {STATUS_META[value].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={channel}
          onValueChange={(value) => setChannel(value as typeof channel)}
        >
          <SelectTrigger className="hidden h-9 w-[9.5rem] md:flex">
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All channels</SelectItem>
            {CHANNELS.map((value) => (
              <SelectItem key={value} value={value}>
                {CHANNEL_META[value].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon-lg"
          className="relative"
          aria-label="Notificaciones"
        >
          <Bell className="size-4" />
          <Badge
            variant="secondary"
            className="bg-primary text-primary-foreground absolute -top-1 -right-1 h-4 min-w-4 rounded-full px-1 text-[10px] leading-4"
          >
            3
          </Badge>
        </Button>

        <Button size="sm" className="h-9" onClick={onCreate}>
          <Plus className="size-4" />
          <span className="hidden sm:inline">New post</span>
          <span className="sm:hidden">New</span>
        </Button>

        <Avatar className="ml-1 hidden size-8 rounded-full lg:flex">
          <AvatarFallback className="text-xs">{MEMBERS[0].initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
