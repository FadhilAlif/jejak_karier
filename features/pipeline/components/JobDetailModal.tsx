"use client"

import { useState, useEffect } from "react"
import {
  Buildings,
  MapPin,
  Briefcase,
  CurrencyDollar,
  ArrowSquareOut,
  CalendarBlank,
  Trash,
  PencilSimple,
  FloppyDisk,
  X,
  Clock,
  ArrowRight,
  PaperPlaneTilt,
  Warning,
  Check,
} from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import {
  useApplications,
  useUpdateApplication,
  useDeleteApplication,
} from "@/features/pipeline/hooks/useApplications"
import {
  useNotes,
  useCreateNote,
  useDeleteNote,
  useStatusHistory,
} from "@/features/pipeline/hooks/useNotesAndHistory"
import {
  STATUS_LABELS,
  STATUS_COLORS,
  JOB_TYPE_LABELS,
  APPLICATION_STATUSES,
  JOB_TYPES,
  type ApplicationStatus,
  type JobType,
} from "@/lib/constants"
import { isGhosting, getGhostingDays } from "@/lib/ghosting"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import type { Tables } from "@/types/supabase"

type Application = Tables<"applications">

interface JobDetailModalProps {
  applicationId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JobDetailModal({
  applicationId,
  open,
  onOpenChange,
}: JobDetailModalProps): React.JSX.Element {
  const { data: applications = [] } = useApplications()
  const updateApplication = useUpdateApplication()
  const deleteApplication = useDeleteApplication()
  const { data: notes = [], isLoading: notesLoading } = useNotes(applicationId)
  const { data: history = [], isLoading: historyLoading } = useStatusHistory(applicationId)
  const createNote = useCreateNote()
  const deleteNote = useDeleteNote()

  const [noteContent, setNoteContent] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    company_name: "",
    role: "",
    job_type: "",
    location: "",
    salary_range: "",
    job_url: "",
    description: "",
  })

  const application = applications.find((a) => a.id === applicationId)

  useEffect(() => {
    if (application && isEditing) {
      setEditForm({
        company_name: application.company_name ?? "",
        role: application.role ?? "",
        job_type: application.job_type ?? "",
        location: application.location ?? "",
        salary_range: application.salary_range ?? "",
        job_url: application.job_url ?? "",
        description: application.description ?? "",
      })
    }
  }, [application, isEditing])

  useEffect(() => {
    if (application) {
      setEditForm({
        company_name: application.company_name ?? "",
        role: application.role ?? "",
        job_type: application.job_type ?? "",
        location: application.location ?? "",
        salary_range: application.salary_range ?? "",
        job_url: application.job_url ?? "",
        description: application.description ?? "",
      })
    }
  }, [application?.id])

  if (!application) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full border-border bg-card sm:max-w-[480px] p-0">
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">Lamaran tidak ditemukan</p>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  const ghosting = isGhosting(application.last_activity_date, application.status)
  const ghostingDays = getGhostingDays(application.last_activity_date)

  function handleStatusChange(newStatus: string): void {
    if (!applicationId) return
    updateApplication.mutate({ id: applicationId, status: newStatus })
  }

  function handleSaveEdit(): void {
    if (!applicationId) return
    updateApplication.mutate(
      {
        id: applicationId,
        company_name: editForm.company_name.trim() || undefined,
        role: editForm.role.trim() || undefined,
        job_type: editForm.job_type || null,
        location: editForm.location.trim() || null,
        salary_range: editForm.salary_range.trim() || null,
        job_url: editForm.job_url.trim() || null,
        description: editForm.description.trim() || null,
      },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      }
    )
  }

  function handleCancelEdit(): void {
    setIsEditing(false)
    if (application) {
      setEditForm({
        company_name: application.company_name ?? "",
        role: application.role ?? "",
        job_type: application.job_type ?? "",
        location: application.location ?? "",
        salary_range: application.salary_range ?? "",
        job_url: application.job_url ?? "",
        description: application.description ?? "",
      })
    }
  }

  function handleAddNote(): void {
    if (!applicationId || !noteContent.trim()) return
    createNote.mutate(
      { applicationId, content: noteContent.trim() },
      { onSuccess: () => setNoteContent("") }
    )
  }

  function handleDeleteNote(noteId: string): void {
    if (!applicationId) return
    deleteNote.mutate({ noteId, applicationId })
  }

  function handleDelete(): void {
    if (!applicationId) return
    deleteApplication.mutate(applicationId, {
      onSuccess: () => {
        setDeleteConfirmOpen(false)
        onOpenChange(false)
      },
    })
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  function formatDateTime(dateStr: string | null): string {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full border-border bg-card sm:max-w-[480px] p-0 flex flex-col gap-0">
          <SheetHeader className="px-5 pt-5 pb-0 space-y-0">
            <div className="flex-1 min-w-0 pr-6">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editForm.company_name}
                    onChange={(e) => setEditForm((f) => ({ ...f, company_name: e.target.value }))}
                    className="h-7 text-sm font-semibold"
                    placeholder="Nama perusahaan"
                  />
                  <Input
                    value={editForm.role}
                    onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                    className="h-6 text-xs text-muted-foreground"
                    placeholder="Posisi"
                  />
                </div>
              ) : (
                <>
                  <SheetTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Buildings weight="duotone" className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{application.company_name}</span>
                  </SheetTitle>
                  <p className="mt-0.5 text-xs text-muted-foreground pl-6">
                    {application.role}
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-1 pt-3">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1 px-2 text-[10px] text-muted-foreground"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-3 w-3" />
                    <span>Batal</span>
                  </Button>
                  <Button
                    size="sm"
                    className="h-6 gap-1 px-2 text-[10px]"
                    onClick={handleSaveEdit}
                    disabled={updateApplication.isPending}
                  >
                    <FloppyDisk className="h-3 w-3" />
                    <span>{updateApplication.isPending ? "Menyimpan..." : "Simpan"}</span>
                  </Button>
                </>
              ) : (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 gap-1 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                        onClick={() => setIsEditing(true)}
                      >
                        <PencilSimple className="h-3 w-3" />
                        <span>Edit</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">Edit lamaran</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 gap-1 px-2 text-[10px] text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteConfirmOpen(true)}
                      >
                        <Trash className="h-3 w-3" />
                        <span>Hapus</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">Hapus lamaran ini</TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="px-5 py-4 space-y-5">
              {ghosting && (
                <div className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2">
                  <Warning weight="fill" className="h-4 w-4 text-red-400 shrink-0" />
                  <p className="text-[11px] text-red-400">
                    Tidak ada aktivitas selama <span className="font-semibold">{ghostingDays} hari</span>.
                    Pertimbangkan untuk follow-up.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <MetaField icon={Clock} label="Status">
                  <Select
                    value={application.status}
                    onValueChange={handleStatusChange}
                    disabled={isEditing}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-6 w-full border px-2 text-[10px] font-medium",
                        STATUS_COLORS[application.status as ApplicationStatus]
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {APPLICATION_STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="text-xs">
                          {STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </MetaField>

                <MetaField icon={Briefcase} label="Tipe Kerja">
                  {isEditing ? (
                    <Select
                      value={editForm.job_type || "onsite"}
                      onValueChange={(v) => setEditForm((f) => ({ ...f, job_type: v }))}
                    >
                      <SelectTrigger className="h-6 text-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TYPES.map((t) => (
                          <SelectItem key={t} value={t} className="text-xs">
                            {JOB_TYPE_LABELS[t as JobType]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                      {application.job_type
                        ? JOB_TYPE_LABELS[application.job_type as JobType] ?? application.job_type
                        : "—"}
                    </Badge>
                  )}
                </MetaField>

                <MetaField icon={MapPin} label="Lokasi">
                  {isEditing ? (
                    <Input
                      value={editForm.location}
                      onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
                      className="h-6 text-[11px]"
                      placeholder="cth. Jakarta"
                    />
                  ) : (
                    <span className="text-[12px] text-foreground">
                      {application.location || "—"}
                    </span>
                  )}
                </MetaField>

                <MetaField icon={CurrencyDollar} label="Gaji">
                  {isEditing ? (
                    <Input
                      value={editForm.salary_range}
                      onChange={(e) => setEditForm((f) => ({ ...f, salary_range: e.target.value }))}
                      className="h-6 text-[11px]"
                      placeholder="cth. Rp 15-25 jt"
                    />
                  ) : (
                    <span className="text-[12px] font-medium text-emerald-400/80">
                      {application.salary_range || "—"}
                    </span>
                  )}
                </MetaField>

                <MetaField icon={CalendarBlank} label="Ditambahkan">
                  <span className="text-[11px] text-muted-foreground">
                    {formatDate(application.created_at)}
                  </span>
                </MetaField>

                <MetaField icon={Clock} label="Aktivitas Terakhir">
                  <span className="text-[11px] text-muted-foreground">
                    {formatDate(application.last_activity_date)}
                  </span>
                </MetaField>
              </div>

              {/* Job URL */}
              {isEditing ? (
                <MetaField icon={ArrowSquareOut} label="URL Lowongan">
                  <Input
                    value={editForm.job_url}
                    onChange={(e) => setEditForm((f) => ({ ...f, job_url: e.target.value }))}
                    className="h-6 text-[11px]"
                    placeholder="https://..."
                    type="url"
                  />
                </MetaField>
              ) : (
                application.job_url && (
                  <a
                    href={application.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-[11px] text-muted-foreground transition-snappy hover:bg-accent/30 hover:text-foreground"
                  >
                    <ArrowSquareOut className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{application.job_url}</span>
                  </a>
                )
              )}

              {/* Description */}
              {isEditing ? (
                <MetaField icon={Briefcase} label="Deskripsi">
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                    className="min-h-[80px] resize-none text-xs"
                    placeholder="Catatan singkat tentang posisi ini..."
                  />
                </MetaField>
              ) : (
                application.description && (
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground/60 mb-1.5">
                      Deskripsi
                    </p>
                    <p className="text-[12px] leading-relaxed text-foreground/80 whitespace-pre-wrap">
                      {application.description}
                    </p>
                  </div>
                )
              )}

              <Separator className="opacity-30" />

              <Tabs defaultValue="notes" className="w-full">
                <TabsList className="w-full h-8 bg-muted/30 p-0.5">
                  <TabsTrigger
                    value="notes"
                    className="flex-1 h-7 text-[11px] data-[state=active]:bg-accent"
                  >
                    Catatan ({notes.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="timeline"
                    className="flex-1 h-7 text-[11px] data-[state=active]:bg-accent"
                  >
                    Timeline ({history.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="notes" className="mt-3 space-y-3">
                  <div className="flex gap-2">
                    <Textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Tulis catatan..."
                      className="min-h-[60px] resize-none text-xs flex-1"
                      onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                          e.preventDefault()
                          handleAddNote()
                        }
                      }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      className="h-6 gap-1 px-2 text-[10px]"
                      disabled={!noteContent.trim() || createNote.isPending}
                      onClick={handleAddNote}
                    >
                      <PaperPlaneTilt className="h-3 w-3" />
                      {createNote.isPending ? "Mengirim..." : "Kirim"}
                    </Button>
                  </div>

                  {notesLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                    </div>
                  ) : notes.length === 0 ? (
                    <p className="py-4 text-center text-[11px] text-muted-foreground/50">
                      Belum ada catatan
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="group relative rounded-md border border-border bg-muted/20 px-3 py-2"
                        >
                          <p className="text-[12px] text-foreground/80 whitespace-pre-wrap pr-6">
                            {note.content}
                          </p>
                          <p className="mt-1.5 text-[10px] text-muted-foreground/50">
                            {formatDateTime(note.created_at)}
                          </p>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="absolute right-2 top-2 opacity-0 transition-snappy group-hover:opacity-100"
                          >
                            <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="timeline" className="mt-3">
                  {historyLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                    </div>
                  ) : history.length === 0 ? (
                    <p className="py-4 text-center text-[11px] text-muted-foreground/50">
                      Belum ada perubahan status
                    </p>
                  ) : (
                    <div className="relative space-y-0 pl-4">
                      <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />

                      {history.map((entry) => (
                        <div key={entry.id} className="relative flex items-start gap-3 py-2">
                          <div className="absolute left-[-13px] top-[10px] h-2 w-2 rounded-full bg-muted-foreground/40" />

                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {entry.from_status && (
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    "h-4 px-1.5 text-[9px] font-medium border",
                                    STATUS_COLORS[entry.from_status as ApplicationStatus]
                                  )}
                                >
                                  {STATUS_LABELS[entry.from_status as ApplicationStatus] ?? entry.from_status}
                                </Badge>
                              )}
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "h-4 px-1.5 text-[9px] font-medium border",
                                  STATUS_COLORS[entry.to_status as ApplicationStatus]
                                )}
                              >
                                {STATUS_LABELS[entry.to_status as ApplicationStatus] ?? entry.to_status}
                              </Badge>
                            </div>
                            <p className="mt-1 text-[10px] text-muted-foreground/50">
                              {formatDateTime(entry.changed_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-sm border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">
              Hapus Lamaran
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Apakah kamu yakin ingin menghapus lamaran ke{" "}
              <span className="font-medium text-foreground">
                {application.company_name}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-7 text-xs"
              onClick={handleDelete}
              disabled={deleteApplication.isPending}
            >
              {deleteApplication.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function MetaField({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
        <Icon className="h-3 w-3" />
        <span>{label}</span>
      </div>
      {children}
    </div>
  )
}