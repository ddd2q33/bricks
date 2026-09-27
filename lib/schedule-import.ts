import {
  CHANNELS,
  MEMBERS,
  POST_STATUSES,
  type Channel,
  type Member,
  type Post,
  type PostStatus,
} from "@/lib/content"
import { addDays, dateKey, startOfDay, startOfWeek } from "@/lib/date"

export const SCOPES = ["day", "week", "month", "custom"] as const

export type Scope = (typeof SCOPES)[number]

export const SCOPE_LABELS: Record<Scope, string> = {
  day: "Single day",
  week: "Week (Mon–Sun)",
  month: "Month",
  custom: "Custom range",
}

export type ScheduleDraft = Omit<Post, "id">

export type ImportIssue = { position: number; message: string }

export type ImportPreview = {
  posts: ScheduleDraft[]
  issues: ImportIssue[]
  duplicates: number
  outOfRange: number
  range: { start: string; end: string } | null
  byChannel: { channel: Channel; count: number }[]
  byStatus: { status: PostStatus; count: number }[]
}

const CHANNEL_ALIASES: Record<string, Channel> = {
  instagram: "instagram",
  ig: "instagram",
  insta: "instagram",
  "instagram post": "instagram",
  tiktok: "tiktok",
  tictok: "tiktok",
  "tik tok": "tiktok",
  "tik-tok": "tiktok",
  linkedin: "linkedin",
  "linked in": "linkedin",
  li: "linkedin",
  x: "x",
  twitter: "x",
  "twitter/x": "x",
  "x/twitter": "x",
  youtube: "youtube",
  yt: "youtube",
  "you tube": "youtube",
  pinterest: "pinterest",
  pin: "pinterest",
  pinterestp: "pinterest",
  blog: "blog",
  web: "blog",
  website: "blog",
  "bricks blog": "blog",
}

const STATUS_ALIASES: Record<string, PostStatus> = {
  draft: "draft",
  borrador: "draft",
  "in draft": "draft",
  "to do": "draft",
  in_review: "in_review",
  review: "in_review",
  "in review": "in_review",
  pendiente: "in_review",
  "needs review": "in_review",
  approved: "approved",
  aprobado: "approved",
  approved_: "approved",
  ready: "approved",
  scheduled: "scheduled",
  programado: "scheduled",
  planned: "scheduled",
  queued: "scheduled",
  published: "published",
  posted: "published",
  publicado: "published",
  done: "published",
  live: "published",
}

function squash(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
}

function deaccent(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "")
}

export function resolveChannel(value: unknown): Channel | null {
  const key = squash(value)
  if (!key) return null
  return CHANNEL_ALIASES[key] ?? null
}

export function resolveStatus(value: unknown): PostStatus | null {
  const key = squash(value)
  if (!key) return null
  return STATUS_ALIASES[key] ?? null
}

export function resolveMember(value: unknown): Member | null {
  if (typeof value === "string") {
    const key = deaccent(squash(value))
    if (!key) return null
    const byId = MEMBERS.find((member) => squash(member.id) === key)
    if (byId) return byId
    const byName = MEMBERS.find((member) => deaccent(squash(member.name)) === key)
    if (byName) return byName
    return MEMBERS.find((member) => deaccent(squash(member.role)) === key) ?? null
  }
  return null
}

function parseLocalDateTime(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value)
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value)
  }
  if (typeof value !== "string") return null

  const text = value.trim()
  if (!text) return null

  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{2}))?)?/.exec(text)
  if (iso) {
    return new Date(
      Number(iso[1]),
      Number(iso[2]) - 1,
      Number(iso[3]),
      iso[4] ? Number(iso[4]) : 0,
      iso[5] ? Number(iso[5]) : 0,
      0,
      0,
    )
  }

  const stamp = Date.parse(text)
  if (Number.isNaN(stamp)) return null
  const parsed = new Date(stamp)
  return new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate(),
    parsed.getHours(),
    parsed.getMinutes(),
    0,
    0,
  )
}

function parseClock(value: unknown): { hours: number; minutes: number } | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    const hours = Math.floor(value)
    const minutes = Math.round((value - hours) * 60)
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return { hours, minutes }
    }
    return null
  }
  if (typeof value !== "string") return null

  const text = value.trim().toLowerCase().replace(/\s+/g, "")
  if (!text) return null

  const meridiem = /(am|a|pm|p)$/.exec(text)
  const body = meridiem ? text.slice(0, -meridiem[1].length) : text
  const parts = /^(\d{1,2})(?::(\d{1,2}))?$/.exec(body)
  if (!parts) return null

  let hours = Number(parts[1])
  const minutes = parts[2] ? Number(parts[2]) : 0
  if (minutes > 59) return null

  if (meridiem) {
    if (hours < 1 || hours > 12) return null
    if (meridiem[1].startsWith("p") && hours !== 12) hours += 12
    if (meridiem[1].startsWith("a") && hours === 12) hours = 0
  }
  if (hours > 23) return null
  return { hours, minutes }
}

export function scopeAnchor(scope: Scope, date: Date): Date {
  if (scope === "week") return startOfWeek(date)
  if (scope === "month") {
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }
  return startOfDay(date)
}

export function scopeWindow(
  scope: Scope,
  date: Date,
): { start: Date; end: Date } | null {
  if (scope === "custom") return null
  const start = scopeAnchor(scope, date)
  if (scope === "day") return { start, end: start }
  if (scope === "week") return { start, end: addDays(start, 6) }
  return { start, end: new Date(date.getFullYear(), date.getMonth() + 1, 0) }
}

type Row = Record<string, unknown>

function firstDefined(row: Row, keys: string[]): unknown {
  for (const key of keys) {
    const value = row[key]
    if (value !== undefined && value !== null && value !== "") return value
  }
  return undefined
}

function readArray(root: unknown): { items: Row[]; container: Row } {
  if (Array.isArray(root)) {
    return { items: root.filter((item): item is Row => typeof item === "object" && item !== null), container: {} }
  }
  if (typeof root !== "object" || root === null) {
    return { items: [], container: {} }
  }
  const container = root as Row
  const candidate = firstDefined(container, ["posts", "schedule", "items", "content", "entries"])
  if (Array.isArray(candidate)) {
    return {
      items: candidate.filter((item): item is Row => typeof item === "object" && item !== null),
      container,
    }
  }
  return { items: [], container }
}

export type ParseOptions = {
  anchor: Date
  scope: Scope
  restrictToScope: boolean
  existing: Post[]
}

function countBy<T extends string>(pairs: [T, number][]): { key: T; count: number }[] {
  const totals = new Map<T, number>()
  for (const [key, amount] of pairs) {
    totals.set(key, (totals.get(key) ?? 0) + amount)
  }
  return [...totals.entries()].map(([key, count]) => ({ key, count }))
}

export function parseScheduleJson(raw: string, options: ParseOptions): ImportPreview {
  const empty: ImportPreview = {
    posts: [],
    issues: [],
    duplicates: 0,
    outOfRange: 0,
    range: null,
    byChannel: [],
    byStatus: [],
  }

  const text = raw.trim()
  if (!text) return empty

  let root: unknown
  try {
    root = JSON.parse(text)
  } catch (error) {
    return {
      ...empty,
      issues: [{ position: 0, message: `Invalid JSON: ${(error as Error).message}` }],
    }
  }

  const { items, container } = readArray(root)
  if (items.length === 0) {
    return {
      ...empty,
      issues: [
        {
          position: 0,
          message: 'No posts found. Expected a "posts" array (or a plain array of posts).',
        },
      ],
    }
  }

  const defaults = (firstDefined(container, ["defaults", "default"]) as Row | undefined) ?? {}
  const anchor = scopeAnchor(options.scope, options.anchor)
  const window = options.restrictToScope ? scopeWindow(options.scope, options.anchor) : null
  const issues: ImportIssue[] = []
  const drafts: ScheduleDraft[] = []

  const seen = new Set(
    options.existing.map((post) => `${squash(post.title)}|${post.channel}|${dateKey(new Date(post.scheduledFor))}`),
  )
  let duplicates = 0
  let outOfRange = 0

  items.forEach((row, index) => {
    const position = index + 1
    const title = firstDefined(row, ["title", "name", "headline", "text"])
    if (typeof title !== "string" || !title.trim()) {
      issues.push({ position, message: 'Missing "title".' })
      return
    }

    const channelValue = firstDefined(row, ["channel", "platform", "network", "social"])
    const channel =
      resolveChannel(channelValue) ?? resolveChannel(firstDefined(defaults, ["channel", "platform"]))
    if (!channel) {
      issues.push({
        position,
        message: `Unknown channel ${JSON.stringify(channelValue ?? null)}. Allowed: ${CHANNELS.join(", ")}.`,
      })
      return
    }

    const statusValue = firstDefined(row, ["status", "state"])
    const status =
      resolveStatus(statusValue) ?? resolveStatus(firstDefined(defaults, ["status", "state"])) ?? "draft"

    const authorValue = firstDefined(row, ["authorId", "author", "owner", "assignee"])
    const author =
      resolveMember(authorValue) ??
      resolveMember(firstDefined(defaults, ["authorId", "author"])) ??
      MEMBERS[0]

    const instant = parseLocalDateTime(
      firstDefined(row, ["scheduledFor", "datetime", "dateTime", "publishAt"]),
    )
    const dayValue = parseLocalDateTime(firstDefined(row, ["day", "date", "when"]))
    const offset = firstDefined(row, ["dayOffset", "offset", "dayIndex"])
    const offsetDays = typeof offset === "number" ? offset : Number.parseInt(String(offset ?? ""), 10)
    const timeValue = firstDefined(row, ["time", "hour", "at"])
    const clock = parseClock(timeValue)

    let scheduled: Date
    if (instant) {
      scheduled = instant
      if (clock) {
        scheduled = new Date(scheduled)
        scheduled.setHours(clock.hours, clock.minutes, 0, 0)
      }
    } else if (dayValue) {
      scheduled = clock
        ? new Date(dayValue.getFullYear(), dayValue.getMonth(), dayValue.getDate(), clock.hours, clock.minutes, 0, 0)
        : dayValue
    } else if (Number.isFinite(offsetDays)) {
      const base = addDays(anchor, offsetDays)
      scheduled = clock
        ? new Date(base.getFullYear(), base.getMonth(), base.getDate(), clock.hours, clock.minutes, 0, 0)
        : atNine(base)
    } else {
      issues.push({
        position,
        message: 'Missing a date. Provide "scheduledFor", "day", or "dayOffset".',
      })
      return
    }

    if (window) {
      const end = new Date(window.end)
      end.setHours(23, 59, 59, 999)
      if (scheduled < window.start || scheduled > end) {
        outOfRange += 1
        if (options.restrictToScope) return
      }
    }

    const key = `${squash(title)}|${channel}|${dateKey(scheduled)}`
    if (seen.has(key)) {
      duplicates += 1
      issues.push({ position, message: `Duplicate of an existing post: "${title.trim()}".` })
      return
    }
    seen.add(key)

    const tagsValue = firstDefined(row, ["tags", "labels"])
    const tags = Array.isArray(tagsValue)
      ? tagsValue.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean)
      : typeof tagsValue === "string"
        ? tagsValue.split(",").map((tag) => tag.trim()).filter(Boolean)
        : []

    const caption = firstDefined(row, ["caption", "copy", "body", "description", "content"])
    const campaign = firstDefined(row, ["campaign", "campaignName"])

    drafts.push({
      title: title.trim(),
      caption: typeof caption === "string" ? caption.trim() : "",
      status,
      channel,
      authorId: author.id,
      scheduledFor: scheduled.toISOString(),
      tags: typeof campaign === "string" && campaign.trim() ? [...tags, campaign.trim()] : tags,
    })
  })

  drafts.sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))

  const range = drafts.length
    ? {
        start: dateKey(new Date(drafts[0].scheduledFor)),
        end: dateKey(new Date(drafts[drafts.length - 1].scheduledFor)),
      }
    : null

  return {
    posts: drafts,
    issues,
    duplicates,
    outOfRange,
    range,
    byChannel: countBy(drafts.map((draft) => [draft.channel, 1] as [Channel, number]))
      .map(({ key, count }) => ({ channel: key, count }))
      .sort((a, b) => b.count - a.count),
    byStatus: countBy(drafts.map((draft) => [draft.status, 1] as [PostStatus, number]))
      .map(({ key, count }) => ({ status: key, count }))
      .sort((a, b) => b.count - a.count),
  }
}

function atNine(date: Date): Date {
  const next = startOfDay(date)
  next.setHours(9, 0, 0, 0)
  return next
}

export function scheduleTemplate(anchor: Date): string {
  const monday = startOfWeek(anchor)
  return JSON.stringify(
    {
      period: { type: "week", start: dateKey(monday) },
      defaults: { channel: "instagram", status: "draft", authorId: MEMBERS[0].id },
      posts: [
        {
          title: "Monday product teaser",
          caption: "Short hook for the week ahead.",
          channel: "instagram",
          status: "scheduled",
          authorId: MEMBERS[0].id,
          day: dateKey(monday),
          time: "09:30",
          tags: ["launch"],
        },
        {
          title: "Long form article recap",
          caption: "What we shipped and what comes next.",
          channel: "blog",
          status: "draft",
          dayOffset: 1,
          time: "11:00",
          tags: ["recap"],
        },
      ],
    },
    null,
    2,
  )
}

export const TEMPLATE_HELP = [
  'Wrap everything in a "posts" array (a bare array also works).',
  'Per post: "title" (required), "channel", "status", "scheduledFor" or "day" + "time".',
  'Use "dayOffset": 0 for the first day of the selected scope, 1 for the next, and so on.',
  `Channels: ${CHANNELS.join(", ")}. Statuses: ${POST_STATUSES.join(", ")}.`,
  "Add a root-level \"defaults\" object to avoid repeating channel/status on every post.",
].join(" ")
