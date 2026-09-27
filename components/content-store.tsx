"use client"

import * as React from "react"

import type { Channel, Post, PostStatus } from "@/lib/content"
import { buildSeedPosts } from "@/lib/seed"

type Draft = Omit<Post, "id">

type ContentContextValue = {
  now: Date
  posts: Post[]
  query: string
  status: PostStatus | "all"
  channel: Channel | "all"
  setQuery: (query: string) => void
  setStatus: (status: PostStatus | "all") => void
  setChannel: (channel: Channel | "all") => void
  createPost: (draft: Draft) => void
  importPosts: (drafts: Draft[]) => number
  updatePost: (id: string, patch: Partial<Draft>) => void
  deletePost: (id: string) => void
  getPost: (id: string) => Post | undefined
  visiblePosts: Post[]
}

const ContentContext = React.createContext<ContentContextValue | null>(null)

function matches(post: Post, query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return (
    post.title.toLowerCase().includes(needle) ||
    post.caption.toLowerCase().includes(needle) ||
    post.tags.some((tag) => tag.toLowerCase().includes(needle))
  )
}

export function ContentProvider({
  now,
  children,
}: {
  now: number
  children: React.ReactNode
}) {
  const [posts, setPosts] = React.useState<Post[]>(() => buildSeedPosts(now))
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<PostStatus | "all">("all")
  const [channel, setChannel] = React.useState<Channel | "all">("all")
  const sequence = React.useRef(0)

  const nextId = React.useCallback(() => {
    sequence.current += 1
    return `post-${Date.now().toString(36)}-${sequence.current.toString(36)}`
  }, [])

  const createPost = React.useCallback(
    (draft: Draft) => {
      setPosts((current) => [...current, { ...draft, id: nextId() }])
    },
    [nextId],
  )

  const importPosts = React.useCallback(
    (drafts: Draft[]) => {
      setPosts((current) => [
        ...current,
        ...drafts.map((draft) => ({ ...draft, id: nextId() })),
      ])
      return drafts.length
    },
    [nextId],
  )


  const updatePost = React.useCallback((id: string, patch: Partial<Draft>) => {
    setPosts((current) =>
      current.map((post) => (post.id === id ? { ...post, ...patch } : post)),
    )
  }, [])

  const deletePost = React.useCallback((id: string) => {
    setPosts((current) => current.filter((post) => post.id !== id))
  }, [])

  const getPost = React.useCallback(
    (id: string) => posts.find((post) => post.id === id),
    [posts],
  )

  const visiblePosts = React.useMemo(
    () =>
      posts.filter(
        (post) =>
          (status === "all" || post.status === status) &&
          (channel === "all" || post.channel === channel) &&
          matches(post, query),
      ),
    [posts, status, channel, query],
  )

  const value = React.useMemo<ContentContextValue>(
    () => ({
      now: new Date(now),
      posts,
      query,
      status,
      channel,
      setQuery,
      setStatus,
      setChannel,
      createPost,
      importPosts,
      updatePost,
      deletePost,
      getPost,
      visiblePosts,
    }),
    [
      now,
      posts,
      query,
      status,
      channel,
      createPost,
      importPosts,
      updatePost,
      deletePost,
      getPost,
      visiblePosts,
    ],
  )

  return <ContentContext value={value}>{children}</ContentContext>
}

export function useContent() {
  const context = React.useContext(ContentContext)
  if (!context) {
    throw new Error("useContent must be used inside <ContentProvider>")
  }
  return context
}
