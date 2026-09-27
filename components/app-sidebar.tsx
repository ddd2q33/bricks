"use client"

import {
  Archive,
  CalendarDays,
  ChartColumnBig,
  ChevronsUpDown,
  FolderKanban,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"

import { BrandMark } from "@/components/brand"
import { ChannelIcon } from "@/components/content-badges"
import { useContent } from "@/components/content-store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { CHANNELS, MEMBERS } from "@/lib/content"

type NavItem = {
  label: string
  icon: LucideIcon
  active?: boolean
}

const MAIN_NAV: NavItem[] = [
  { label: "Calendar", icon: CalendarDays, active: true },
  { label: "Content", icon: FolderKanban },
  { label: "Kanban", icon: LayoutGrid },
  { label: "Library", icon: Archive },
  { label: "Analytics", icon: ChartColumnBig },
]

const WORKSPACE_NAV: NavItem[] = [
  { label: "Team", icon: Users },
  { label: "Settings", icon: Settings },
]

export function AppSidebar() {
  const { posts } = useContent()

  const reviewCount = posts.filter((post) => post.status === "in_review").length
  const scheduledCount = posts.filter((post) => post.status === "scheduled").length

  const counts: Record<string, number> = {
    Content: posts.length,
    Kanban: reviewCount,
    Calendar: scheduledCount,
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="gap-2">
              <BrandMark className="size-8 rounded-md" />
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold">Bricks</span>
                <span className="truncate text-xs text-muted-foreground">
                  Content Scheduler
                </span>
              </div>
              <ChevronsUpDown className="text-muted-foreground ml-auto size-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_NAV.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton isActive={item.active} tooltip={item.label}>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  {item.active ? (
                    <SidebarMenuBadge>{scheduledCount}</SidebarMenuBadge>
                  ) : counts[item.label] ? (
                    <SidebarMenuBadge>{counts[item.label]}</SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Channels</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {CHANNELS.map((channel) => (
                <SidebarMenuItem key={channel}>
                  <SidebarMenuButton tooltip={channel}>
                    <ChannelIcon channel={channel} className="size-5 rounded-[5px]" />
                    <span className="capitalize">{channel}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {WORKSPACE_NAV.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton tooltip={item.label}>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Support">
              <LifeBuoy />
              <span>Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="gap-2" tooltip="Manuela Restrepo">
              <Avatar className="size-6 rounded-md">
                <AvatarFallback className="text-[10px]">
                  {MEMBERS[0].initials}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">Manuela Restrepo</span>
              <LogOut className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
