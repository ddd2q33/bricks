import type { Channel, Post, PostStatus } from "@/lib/content"
import { addDays, atTime, startOfWeek } from "@/lib/date"

type Seed = {
  day: number
  hour: number
  minute?: number
  title: string
  caption: string
  status: PostStatus
  channel: Channel
  authorId: string
  tags: string[]
}

const lastWeek: Seed[] = [
  {
    day: 0,
    hour: 9,
    title: "Unboxing the reduction kiln",
    caption: "The full haul from kiln number 12.",
    status: "published",
    channel: "instagram",
    authorId: "m2",
    tags: ["bts"],
  },
  {
    day: 1,
    hour: 11,
    title: "Choosing clay for planters",
    caption: "A quick guide to clays and firing temperatures.",
    status: "published",
    channel: "blog",
    authorId: "m4",
    tags: ["education"],
  },
  {
    day: 2,
    hour: 18,
    title: "Behind the scenes: wedging by hand",
    caption: "No machines involved in this one.",
    status: "published",
    channel: "tiktok",
    authorId: "m3",
    tags: ["bts"],
  },
  {
    day: 3,
    hour: 8,
    title: "The studio is now open on Saturdays",
    caption: "Extended hours all month long.",
    status: "published",
    channel: "linkedin",
    authorId: "m1",
    tags: ["promotion"],
  },
  {
    day: 5,
    hour: 12,
    title: "The studio playlist",
    caption: "What plays while we fire.",
    status: "published",
    channel: "x",
    authorId: "m3",
    tags: ["community"],
  },
]

const currentWeek: Seed[] = [
  {
    day: 0,
    hour: 9,
    title: "Kiln schedule for November",
    caption: "Every firing date for this month, in one post.",
    status: "published",
    channel: "instagram",
    authorId: "m1",
    tags: ["promotion"],
  },
  {
    day: 0,
    hour: 14,
    minute: 30,
    title: "Loading kiln 14",
    caption: "Sixty pieces going in at 1,240 degrees.",
    status: "published",
    channel: "tiktok",
    authorId: "m2",
    tags: ["bts"],
  },
  {
    day: 1,
    hour: 8,
    minute: 30,
    title: "Five surface techniques",
    caption: "A practical guide to the textures we use on every series.",
    status: "scheduled",
    channel: "blog",
    authorId: "m4",
    tags: ["education"],
  },
  {
    day: 1,
    hour: 16,
    title: "Reel: one piece, start to finish",
    caption: "Four stages and sixty seconds, no jump cuts.",
    status: "scheduled",
    channel: "instagram",
    authorId: "m3",
    tags: ["bts"],
  },
  {
    day: 1,
    hour: 19,
    title: "Thread: what a piece really costs",
    caption: "Clay, energy, hours of work and waste.",
    status: "in_review",
    channel: "x",
    authorId: "m1",
    tags: ["education"],
  },
  {
    day: 2,
    hour: 10,
    title: "The hand wheel, no shortcuts",
    caption: "Forty minutes at the wheel, filmed end to end.",
    status: "approved",
    channel: "youtube",
    authorId: "m2",
    tags: ["education"],
  },
  {
    day: 2,
    hour: 13,
    title: "Talk with the ceramics collective",
    caption: "An open conversation on standards and craft.",
    status: "draft",
    channel: "linkedin",
    authorId: "m1",
    tags: ["community"],
  },
  {
    day: 3,
    hour: 9,
    title: "Newsletter: three gift ideas",
    caption: "Ideas that come out of the studio, not the catalog.",
    status: "in_review",
    channel: "blog",
    authorId: "m4",
    tags: ["promotion"],
  },
  {
    day: 3,
    hour: 12,
    minute: 30,
    title: "Before and after: a living room",
    caption: "From bare concrete to a lived-in space.",
    status: "scheduled",
    channel: "instagram",
    authorId: "m3",
    tags: ["community"],
  },
  {
    day: 3,
    hour: 18,
    title: "The week's best from the studio",
    caption: "A recap of everything that came out this week.",
    status: "draft",
    channel: "tiktok",
    authorId: "m3",
    tags: ["community"],
  },
  {
    day: 4,
    hour: 10,
    minute: 30,
    title: "Tutorial: matte glazes",
    caption: "Four coats, two dips, an even finish.",
    status: "scheduled",
    channel: "youtube",
    authorId: "m2",
    tags: ["education"],
  },
  {
    day: 4,
    hour: 15,
    title: "Poll: which series should we revive",
    caption: "Two options, one wins the next firing.",
    status: "approved",
    channel: "instagram",
    authorId: "m3",
    tags: ["community"],
  },
  {
    day: 5,
    hour: 11,
    title: "Weekly wrap-up",
    caption: "What we fired, what went well and what did not.",
    status: "draft",
    channel: "x",
    authorId: "m1",
    tags: ["bts"],
  },
  {
    day: 6,
    hour: 12,
    title: "Sunday market, booth three",
    caption: "Come by for coffee and a few gifts.",
    status: "approved",
    channel: "instagram",
    authorId: "m3",
    tags: ["promotion"],
  },
]

const nextWeek: Seed[] = [
  {
    day: 0,
    hour: 9,
    title: "Preorder: the Coral series",
    caption: "Reservations open forty-eight hours early.",
    status: "scheduled",
    channel: "instagram",
    authorId: "m1",
    tags: ["promotion"],
  },
  {
    day: 1,
    hour: 10,
    title: "Food-safe glazes",
    caption: "Which glazes are fine for tableware.",
    status: "approved",
    channel: "blog",
    authorId: "m4",
    tags: ["education"],
  },
  {
    day: 2,
    hour: 17,
    title: "Reel: four hands, one piece",
    caption: "Four people working on the same piece.",
    status: "scheduled",
    channel: "tiktok",
    authorId: "m2",
    tags: ["bts"],
  },
  {
    day: 3,
    hour: 9,
    title: "Firing 15, piece by piece",
    caption: "Everything that came out of the last kiln.",
    status: "scheduled",
    channel: "instagram",
    authorId: "m3",
    tags: ["promotion"],
  },
  {
    day: 4,
    hour: 15,
    minute: 30,
    title: "Live: opening the kiln",
    caption: "We open the kiln live from the studio.",
    status: "approved",
    channel: "youtube",
    authorId: "m2",
    tags: ["community"],
  },
  {
    day: 5,
    hour: 19,
    title: "Thread: how we quote a commission",
    caption: "Materials, hours, mold and the final price.",
    status: "draft",
    channel: "linkedin",
    authorId: "m1",
    tags: ["education"],
  },
]

function toPosts(seeds: Seed[], monday: Date): Post[] {
  return seeds.map((seed, index) => ({
    id: `seed-${monday.getTime()}-${index}`,
    title: seed.title,
    caption: seed.caption,
    status: seed.status,
    channel: seed.channel,
    authorId: seed.authorId,
    scheduledFor: atTime(
      addDays(monday, seed.day),
      seed.hour,
      seed.minute ?? 0,
    ).toISOString(),
    tags: seed.tags,
  }))
}

export function buildSeedPosts(now: number): Post[] {
  const monday = startOfWeek(new Date(now))

  return [
    ...toPosts(lastWeek, addDays(monday, -7)),
    ...toPosts(currentWeek, monday),
    ...toPosts(nextWeek, addDays(monday, 7)),
  ]
}
