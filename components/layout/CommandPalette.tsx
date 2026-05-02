"use client"

import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Kanban,
  ChartBar,
  Plus,
  MagnifyingGlass,
} from "@phosphor-icons/react"

import { useUIStore } from "@/stores/uiStore"
import { useApplications } from "@/features/pipeline/hooks/useApplications"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

interface CommandPaletteProps {
  onAddNew?: () => void
}

export function CommandPalette({ onAddNew }: CommandPaletteProps): React.JSX.Element {
  const router = useRouter()
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore()
  const { data: applications = [] } = useApplications()

  // Keyboard shortcut: Cmd+K / Ctrl+K
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
    },
    [commandPaletteOpen, setCommandPaletteOpen]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  function handleSelect(action: string): void {
    setCommandPaletteOpen(false)

    switch (action) {
      case "add-new":
        onAddNew?.()
        break
      case "go-pipeline":
        router.push("/pipeline")
        break
      case "go-analytics":
        router.push("/analytics")
        break
      default:
        break
    }
  }

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Cari perintah atau lamaran..." />
      <CommandList>
        <CommandEmpty>
          <p className="text-xs text-muted-foreground">Tidak ada hasil.</p>
        </CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Aksi Cepat">
          <CommandItem onSelect={() => handleSelect("add-new")}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Tambah Lamaran Baru</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Navigation */}
        <CommandGroup heading="Navigasi">
          <CommandItem onSelect={() => handleSelect("go-pipeline")}>
            <Kanban className="mr-2 h-4 w-4" />
            <span>Pipeline Lamaran</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("go-analytics")}>
            <ChartBar className="mr-2 h-4 w-4" />
            <span>Analitik</span>
          </CommandItem>
        </CommandGroup>

        {/* Search Applications */}
        {applications.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Lamaran">
              {applications.slice(0, 8).map((app) => (
                <CommandItem
                  key={app.id}
                  value={`${app.company_name} ${app.role}`}
                  onSelect={() => {
                    setCommandPaletteOpen(false)
                    // Navigate to pipeline and the app will be shown
                    router.push("/pipeline")
                  }}
                >
                  <MagnifyingGlass className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-[12px]">{app.company_name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {app.role}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
