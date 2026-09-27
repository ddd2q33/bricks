"use client"

import * as React from "react"

import { Check, Copy, Download, FileUp, TriangleAlert, Upload } from "lucide-react"

import { ChannelIcon } from "@/components/content-badges"
import { useContent } from "@/components/content-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { CHANNEL_META, STATUS_META } from "@/lib/content"
import { dateKey, formatDayHeader, formatWeekRange, startOfWeek } from "@/lib/date"
import { cn } from "@/lib/utils"
import {
  SCOPES,
  SCOPE_LABELS,
  TEMPLATE_HELP,
  parseScheduleJson,
  scheduleTemplate,
  type Scope,
} from "@/lib/schedule-import"

export function ScheduleImportDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { now, posts, importPosts } = useContent()
  const [scope, setScope] = React.useState<Scope>("week")
  const [anchor, setAnchor] = React.useState(() => dateKey(now))
  const [restrict, setRestrict] = React.useState(true)
  const [raw, setRaw] = React.useState("")
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)
  const fileInput = React.useRef<HTMLInputElement>(null)

  const anchorDate = React.useMemo(() => {
    const [year, month, day] = anchor.split("-").map(Number)
    return new Date(year, month - 1, day)
  }, [anchor])

  const preview = React.useMemo(
    () => parseScheduleJson(raw, { anchor: anchorDate, scope, restrictToScope: restrict, existing: posts }),
    [raw, anchorDate, scope, restrict, posts],
  )

  function reset() {
    setRaw("")
    setFileName(null)
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  async function handleFile(file: File | undefined) {
    if (!file) return
    setFileName(file.name)
    setRaw(await file.text())
  }

  async function copyTemplate() {
    await navigator.clipboard.writeText(scheduleTemplate(anchorDate))
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  function downloadTemplate() {
    const blob = new Blob([scheduleTemplate(anchorDate)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "bricks-schedule-template.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  function runImport() {
    const added = importPosts(preview.posts)
    handleOpenChange(false)
    return added
  }

  const anchorPreview = React.useMemo(() => {
    if (scope === "week") return formatWeekRange(startOfWeek(anchorDate))
    if (scope === "day") return formatDayHeader(anchorDate)
    if (scope === "month") {
      return anchorDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }
    return dateKey(anchorDate)
  }, [scope, anchorDate])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
        <DialogHeader className="border-b p-5">
          <DialogTitle>Import schedule</DialogTitle>
          <DialogDescription>
            Upload or paste the JSON schedule produced by your AI. Posts are grouped by
            day, week or month.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="scope">Scope</Label>
              <Select value={scope} onValueChange={(value) => setScope(value as Scope)}>
                <SelectTrigger id="scope" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCOPES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {SCOPE_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="anchor">{scope === "month" ? "Month of" : "Anchor date"}</Label>
              <Input
                id="anchor"
                type="date"
                value={anchor}
                onChange={(event) => setAnchor(event.target.value)}
              />
            </div>
          </div>

          <p className="text-muted-foreground -mt-2 text-xs">
            Posts land on <span className="text-foreground font-medium">{anchorPreview}</span>
            {scope === "custom" ? "" : " unless they carry an explicit date"}.
          </p>

          <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
            <div className="grid gap-0.5">
              <Label htmlFor="restrict" className="text-sm">
                Only keep dates inside the scope
              </Label>
              <p className="text-muted-foreground text-xs">
                Drops posts that fall outside the selected day, week or month.
              </p>
            </div>
            <Switch id="restrict" checked={restrict} onCheckedChange={setRestrict} />
          </div>

          <Tabs defaultValue="file" className="gap-3">
            <TabsList>
              <TabsTrigger value="file">Upload file</TabsTrigger>
              <TabsTrigger value="paste">Paste JSON</TabsTrigger>
            </TabsList>
            <TabsContent value="file">
              <div className="grid gap-3">
                <input
                  ref={fileInput}
                  type="file"
                  accept="application/json,.json"
                  className="sr-only"
                  onChange={(event) => void handleFile(event.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className="hover:bg-accent flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed py-8 text-sm transition-colors"
                >
                  <FileUp className="text-muted-foreground size-5" />
                  <span className="font-medium">
                    {fileName ?? "Choose a .json file"}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {fileName ? "Click to choose a different file" : "or drop it here"}
                  </span>
                </button>
              </div>
            </TabsContent>
            <TabsContent value="paste">
              <Textarea
                value={raw}
                onChange={(event) => {
                  setRaw(event.target.value)
                  setFileName(null)
                }}
                placeholder={'{ "posts": [ { "title": "...", "channel": "instagram", "dayOffset": 0, "time": "09:30" } ] }'}
                className="min-h-40 font-mono text-xs"
                spellCheck={false}
              />
            </TabsContent>
          </Tabs>

          <div className="grid gap-2 rounded-lg border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">Template for your AI</p>
              <div className="flex gap-1.5">
                <Button size="sm" variant="outline" onClick={() => void copyTemplate()}>
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button size="sm" variant="outline" onClick={downloadTemplate}>
                  <Download className="size-3.5" />
                  .json
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground text-xs">{TEMPLATE_HELP}</p>
          </div>

          {raw.trim() ? (
            <div className="grid gap-3 rounded-lg border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">
                  {preview.posts.length} post{preview.posts.length === 1 ? "" : "s"} ready
                </p>
                {preview.range ? (
                  <Badge variant="secondary" className="font-mono text-[11px]">
                    {preview.range.start} → {preview.range.end}
                  </Badge>
                ) : null}
                {preview.outOfRange > 0 ? (
                  <Badge variant="secondary" className="text-[11px]">
                    {preview.outOfRange} outside scope
                  </Badge>
                ) : null}
                {preview.duplicates > 0 ? (
                  <Badge variant="secondary" className="text-[11px]">
                    {preview.duplicates} duplicates skipped
                  </Badge>
                ) : null}
              </div>

              {preview.byChannel.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {preview.byChannel.map(({ channel, count }) => (
                    <span
                      key={channel}
                      className="bg-muted text-muted-foreground flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs"
                    >
                      <ChannelIcon channel={channel} className="size-4 rounded-[4px]" />
                      {CHANNEL_META[channel].label}
                      <span className="font-medium">{count}</span>
                    </span>
                  ))}
                </div>
              ) : null}

              {preview.byStatus.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {preview.byStatus.map(({ status, count }) => (
                    <span
                      key={status}
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-xs",
                        STATUS_META[status].className,
                      )}
                    >
                      {STATUS_META[status].label} · {count}
                    </span>
                  ))}
                </div>
              ) : null}

              {preview.issues.length ? (
                <div className="grid gap-1.5">
                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                    <TriangleAlert className="size-3.5" />
                    {preview.issues.length} issue{preview.issues.length === 1 ? "" : "s"}
                  </p>
                  <ul className="text-muted-foreground max-h-28 space-y-0.5 overflow-y-auto text-xs">
                    {preview.issues.map((issue, index) => (
                      <li key={`${issue.position}-${index}`}>
                        <span className="font-mono">#{issue.position}</span> {issue.message}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <DialogFooter className="border-t p-5">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={runImport} disabled={preview.posts.length === 0}>
            <Upload className="size-4" />
            Import {preview.posts.length} post{preview.posts.length === 1 ? "" : "s"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
