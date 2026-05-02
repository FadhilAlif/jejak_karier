"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useCreateApplication } from "@/features/pipeline/hooks/useApplications"
import {
  APPLICATION_STATUSES,
  STATUS_LABELS,
  JOB_TYPES,
  JOB_TYPE_LABELS,
} from "@/lib/constants"

interface AddJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddJobDialog({
  open,
  onOpenChange,
}: AddJobDialogProps): React.JSX.Element {
  const createApplication = useCreateApplication()

  const [companyName, setCompanyName] = useState("")
  const [role, setRole] = useState("")
  const [status, setStatus] = useState("wishlist")
  const [jobType, setJobType] = useState("onsite")
  const [salaryRange, setSalaryRange] = useState("")
  const [location, setLocation] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [description, setDescription] = useState("")

  function resetForm(): void {
    setCompanyName("")
    setRole("")
    setStatus("wishlist")
    setJobType("onsite")
    setSalaryRange("")
    setLocation("")
    setJobUrl("")
    setDescription("")
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()

    if (!companyName.trim() || !role.trim()) return

    createApplication.mutate(
      {
        company_name: companyName.trim(),
        role: role.trim(),
        status,
        job_type: jobType,
        salary_range: salaryRange.trim() || null,
        location: location.trim() || null,
        job_url: jobUrl.trim() || null,
        description: description.trim() || null,
      },
      {
        onSuccess: () => {
          resetForm()
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">
            Tambah Lamaran Baru
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Company Name */}
          <div className="space-y-1.5">
            <Label htmlFor="add-company" className="text-xs">
              Nama Perusahaan *
            </Label>
            <Input
              id="add-company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="cth. Tokopedia"
              className="h-8 text-xs"
              autoFocus
              required
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label htmlFor="add-role" className="text-xs">
              Posisi *
            </Label>
            <Input
              id="add-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="cth. Frontend Engineer"
              className="h-8 text-xs"
              required
            />
          </div>

          {/* Status & Job Type Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-8 text-xs">
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
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Tipe Kerja</Label>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="text-xs">
                      {JOB_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location & Salary Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="add-location" className="text-xs">
                Lokasi
              </Label>
              <Input
                id="add-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="cth. Jakarta"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-salary" className="text-xs">
                Rentang Gaji
              </Label>
              <Input
                id="add-salary"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="cth. Rp 15-25 jt"
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* Job URL */}
          <div className="space-y-1.5">
            <Label htmlFor="add-url" className="text-xs">
              URL Lowongan
            </Label>
            <Input
              id="add-url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://..."
              className="h-8 text-xs"
              type="url"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="add-desc" className="text-xs">
              Catatan
            </Label>
            <Textarea
              id="add-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Catatan singkat tentang posisi ini..."
              className="min-h-[60px] resize-none text-xs"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-7 text-xs"
              disabled={createApplication.isPending}
            >
              {createApplication.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
