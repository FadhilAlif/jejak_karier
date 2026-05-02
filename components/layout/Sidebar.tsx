"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Kanban,
  ChartBar,
  SignOut,
  CaretDoubleLeft,
  CaretDoubleRight,
  Briefcase,
} from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { useUIStore } from "@/stores/uiStore"
import { MOCK_USER } from "@/lib/mockAuth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const NAV_ITEMS: NavItem[] = [
  { label: "Pipeline", href: "/pipeline", icon: Kanban },
  { label: "Analitik", href: "/analytics", icon: ChartBar },
]

export function Sidebar(): React.JSX.Element {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-200 ease-in-out",
        sidebarCollapsed ? "w-[52px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-[52px] items-center gap-2 px-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
          <Briefcase weight="duotone" className="h-4 w-4 text-primary" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-sm font-semibold tracking-tight text-foreground">
            JejakKarier
          </span>
        )}
      </div>

      <Separator className="opacity-50" />

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          const linkContent = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-snappy",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Icon
                weight={isActive ? "fill" : "regular"}
                className="h-4 w-4 shrink-0"
              />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          )

          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          }

          return linkContent
        })}
      </nav>

      <Separator className="opacity-50" />

      {/* Footer */}
      <div className="space-y-1 px-2 py-2">
        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-muted-foreground transition-snappy hover:bg-accent/50 hover:text-foreground"
        >
          {sidebarCollapsed ? (
            <CaretDoubleRight className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <CaretDoubleLeft className="h-4 w-4 shrink-0" />
              <span>Tutup</span>
            </>
          )}
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5">
          <Avatar className="h-6 w-6 shrink-0">
            <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
              {MOCK_USER.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {!sidebarCollapsed && (
            <div className="flex flex-1 items-center justify-between">
              <span className="truncate text-[12px] text-muted-foreground">
                {MOCK_USER.full_name}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground transition-snappy hover:text-foreground">
                    <SignOut className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  Keluar
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
