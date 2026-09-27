"use client"

import * as React from "react"
import { Trash } from "lucide-react"

import { ChannelIcon } from "@/components/content-badges"
import { useContent } from "@/components/content-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import {
  CHANNELS,
  CHANNEL_META,
  MEMBERS,
  POST_STATUSES,
  STATUS_META,
  type Channel,
  type Post,
  type PostStatus,
} from "@/lib/content"
import { dateKey, fromDateAndTime, timeKey } from "@/lib/date"

type FormState = {
  title: string
  caption: string
  status: PostStatus
  channel: Channel
  authorId: string
  day: string
  time: string
  tags: string
}

function toFormState(post: Post | null, fallback: Date): FormState {
  const base = post ? new Date(post.scheduledFor) : fallback

  return {
    title: post?.title ?? "",
    caption: post?.caption ?? "",
    status: post?.status ?? "draft",
    channel: post?.channel ?? "instagram",
    authorId: post?.authorId ?? MEMBERS[0].id,
    day: dateKey(base),
    time: timeKey(base),
    tags: post?.tags.join(", ") ?? "",
  }
}

function PostForm({
  post,
  fallbackDate,
  onClose,
}: {
  post: Post | null
  fallbackDate: Date
  onClose: () => void
}) {
  const { createPost, updatePost, deletePost } = useContent()
  const [state, setState] = React.useState<FormState>(() =>
    toFormState(post, fallbackDate),
  )

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((current) => ({ ...current, [key]: value }))

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const patch = {
      title: state.title.trim() || "Untitled",
      caption: state.caption.trim(),
      status: state.status,
      channel: state.channel,
      authorId: state.authorId,
      scheduledFor: fromDateAndTime(state.day, state.time).toISOString(),
      tags: state.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    if (post) updatePost(post.id, patch)
    else createPost(patch)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <SheetHeader className="border-b px-6 py-4">
        <SheetTitle>
          {post ? "Edit post" : "New post"}
        </SheetTitle>
        <SheetDescription>
          {post
            ? "Changes live in memory only while this prototype runs."
            : "Set the content, the channel and the publish date."}
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
        <div className="grid gap-2">
          <Label htmlFor="post-title">Title</Label>
          <Input
            id="post-title"
            value={state.title}
            onChange={(event) => set("title", event.target.value)}
            placeholder="e.g. Kiln 15 loaded"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="post-caption">Caption</Label>
          <Textarea
            id="post-caption"
            value={state.caption}
            onChange={(event) => set("caption", event.target.value)}
            placeholder="Text that goes with the post"
            rows={4}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="post-channel">Channel</Label>
            <Select
              value={state.channel}
              onValueChange={(value) => set("channel", value as Channel)}
            >
              <SelectTrigger id="post-channel" className="h-9 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHANNELS.map((channel) => (
                  <SelectItem key={channel} value={channel}>
                    <ChannelIcon channel={channel} className="size-5 rounded-[5px]" />
                    {CHANNEL_META[channel].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="post-status">Status</Label>
            <Select
              value={state.status}
              onValueChange={(value) => set("status", value as PostStatus)}
            >
              <SelectTrigger id="post-status" className="h-9 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POST_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {STATUS_META[status].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="post-day">Date</Label>
            <Input
              id="post-day"
              type="date"
              value={state.day}
              onChange={(event) => set("day", event.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="post-time">Time</Label>
            <Input
              id="post-time"
              type="time"
              value={state.time}
              onChange={(event) => set("time", event.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="post-author">Owner</Label>
          <Select
            value={state.authorId}
            onValueChange={(value) => set("authorId", String(value))}
          >
            <SelectTrigger id="post-author" className="h-9 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEMBERS.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name} · {member.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="post-tags">Tags</Label>
          <Input
            id="post-tags"
            value={state.tags}
            onChange={(event) => set("tags", event.target.value)}
            placeholder="bts, education"
          />
          <p className="text-muted-foreground text-xs">Comma separated.</p>
        </div>
      </div>

      <SheetFooter className="mt-auto flex-row gap-2 border-t px-6 py-4">
        {post ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              deletePost(post.id)
              onClose()
            }}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive mr-auto"
          >
            <Trash className="size-4" />
            Delete
          </Button>
        ) : null}
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {post ? "Save changes" : "Create post"}
        </Button>
      </SheetFooter>
    </form>
  )
}

export function PostSheet({
  open,
  post,
  fallbackDate,
  formKey,
  onOpenChange,
}: {
  open: boolean
  post: Post | null
  fallbackDate: Date
  formKey: number
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-lg">
        <PostForm
          key={formKey}
          post={post}
          fallbackDate={fallbackDate}
          onClose={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
