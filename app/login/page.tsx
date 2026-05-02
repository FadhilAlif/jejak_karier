import { Briefcase } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-xs space-y-6 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Briefcase weight="duotone" className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              JejakKarier
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Smart Job Tracker
            </p>
          </div>
        </div>

        {/* Mock Login — bypass auth */}
        <Link
          href="/pipeline"
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-snappy hover:bg-primary/90"
        >
          Masuk sebagai Developer
        </Link>

        <p className="text-[10px] text-muted-foreground/50">
          Mode pengembangan — login Google akan ditambahkan nanti
        </p>
      </div>
    </div>
  )
}
