"use client"

import { Kanban, List, Plus, Command } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { useUIStore } from "@/stores/uiStore"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface HeaderProps {
  title: string
  showViewToggle?: boolean
  onAddNew?: () => void
}

export function Header({
  title,
  showViewToggle = false,
  onAddNew,
}: HeaderProps): React.JSX.Element {
  const { viewMode, setViewMode, setCommandPaletteOpen } = useUIStore()

  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-border px-4">
      {/* Left: Title */}
      <h1 className="text-sm font-semibold tracking-tight text-foreground">
        {title}
      </h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        {/* Command Palette Trigger */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setCommandPaletteOpen(true)}
            >
              <Command className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cmd+K</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-xs">
            Buka command palette
          </TooltipContent>
        </Tooltip>

        {/* View Toggle */}
        {showViewToggle && (
          <div className="flex items-center rounded-md border border-border bg-muted/30 p-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setViewMode("kanban")}
                  className={cn(
                    "rounded-sm p-1 transition-snappy",
                    viewMode === "kanban"
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Kanban className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Kanban</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "rounded-sm p-1 transition-snappy",
                    viewMode === "list"
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Daftar</TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Add New */}
        {onAddNew && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                className="h-7 gap-1.5 px-2.5 text-xs"
                onClick={onAddNew}
              >
                <Plus weight="bold" className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Lamaran Baru</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              Tambah lamaran baru (Ctrl+K)
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </header>
  )
}
