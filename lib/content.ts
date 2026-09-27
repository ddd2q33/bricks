import type { IconType } from "react-icons"
import {
  FaInstagram,
  FaLinkedinIn,
  FaNewspaper,
  FaPinterestP,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6"

export const CHANNELS = [
  "instagram",
  "tiktok",
  "linkedin",
  "x",
  "youtube",
  "pinterest",
  "blog",
] as const

export type Channel = (typeof CHANNELS)[number]

export const POST_STATUSES = [
  "draft",
  "in_review",
  "approved",
  "scheduled",
  "published",
] as const

export type PostStatus = (typeof POST_STATUSES)[number]

export type Post = {
  id: string
  title: string
  caption: string
  status: PostStatus
  channel: Channel
  authorId: string
  scheduledFor: string
  tags: string[]
}

export type Member = {
  id: string
  name: string
  initials: string
  role: string
}

export const MEMBERS: Member[] = [
  { id: "m1", name: "Manuela Restrepo", initials: "MR", role: "Content lead" },
  { id: "m2", name: "Tomás Ángel", initials: "TA", role: "Designer" },
  { id: "m3", name: "Sara Ospina", initials: "SO", role: "Social" },
  { id: "m4", name: "Julián Pérez", initials: "JP", role: "Editor" },
]

export const CHANNEL_META: Record<
  Channel,
  {
    label: string
    short: string
    handle: string
    icon: IconType
    className: string
  }
> = {
  instagram: {
    label: "Instagram",
    short: "IG",
    handle: "@bricks.studio",
    icon: FaInstagram,
    className: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
  tiktok: {
    label: "TikTok",
    short: "TT",
    handle: "@bricks.studio",
    icon: FaTiktok,
    className: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
  },
  linkedin: {
    label: "LinkedIn",
    short: "IN",
    handle: "Bricks Studio",
    icon: FaLinkedinIn,
    className: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  },
  x: {
    label: "X",
    short: "X",
    handle: "@brickshq",
    icon: FaXTwitter,
    className: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
  },
  youtube: {
    label: "YouTube",
    short: "YT",
    handle: "@bricksstudio",
    icon: FaYoutube,
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  pinterest: {
    label: "Pinterest",
    short: "PT",
    handle: "@bricksstudio",
    icon: FaPinterestP,
    className: "bg-rose-600/10 text-rose-700 dark:text-rose-400",
  },
  blog: {
    label: "Blog",
    short: "BL",
    handle: "bricks.co/blog",
    icon: FaNewspaper,
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
}

export const STATUS_META: Record<
  PostStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
  },
  in_review: {
    label: "In review",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    className: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  },
  published: {
    label: "Published",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
}

export const CAMPAIGNS = [
  "Bricks launch",
  "Workshop BTS",
  "Education",
  "Promotion",
  "Community",
] as const
