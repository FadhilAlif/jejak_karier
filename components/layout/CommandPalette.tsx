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

export function CommandPalette(): React.JSX.Element {
  const router = useRouter()
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setHighlightedAppId,
  } = useUIStore()
  const { data: applications = [] } = useApplications()

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

  function handleSelectApp(appId: string): void {
    setCommandPaletteOpen(false)
    setHighlightedAppId(appId)
    router.push("/pipeline")
  }

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Cari perintah atau lamaran..." />
      <CommandList>
        <CommandEmpty>
          <p className="text-xs text-muted-foreground">Tidak ada hasil.</p>
        </CommandEmpty>

        <CommandGroup heading="Aksi Cepat">
          <CommandItem onSelect={() => {
            setCommandPaletteOpen(false)
            setHighlightedAppId("__add_new__")
            router.push("/pipeline")
          }}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Tambah Lamaran Baru</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigasi">
          <CommandItem onSelect={() => {
            setCommandPaletteOpen(false)
            router.push("/pipeline")
          }}>
            <Kanban className="mr-2 h-4 w-4" />
            <span>Pipeline Lamaran</span>
          </CommandItem>
          <CommandItem onSelect={() => {
            setCommandPaletteOpen(false)
            router.push("/analytics")
          }}>
            <ChartBar className="mr-2 h-4 w-4" />
            <span>Analitik</span>
          </CommandItem>
        </CommandGroup>

        {applications.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Lamaran">
              {applications.slice(0, 8).map((app) => (
                <CommandItem
                  key={app.id}
                  value={`${app.company_name} ${app.role}`}
                  onSelect={() => handleSelectApp(app.id)}
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