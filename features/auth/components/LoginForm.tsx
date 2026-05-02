"use client"

import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Briefcase,
  EnvelopeSimple,
  LockSimple,
  Eye,
  EyeSlash,
  SignIn,
  UserPlus,
  ArrowLeft,
  SpinnerGap,
  WarningCircle,
  Kanban,
  Ghost,
  ChartBar,
} from "@phosphor-icons/react"

import { createClient } from "@/lib/supabase/client"

type AuthView = "login" | "signup" | "confirmation"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [view, setView] = useState<AuthView>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const authError = searchParams.get("error")

  const handleEmailAuth = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setError(null)

      try {
        if (view === "signup") {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: email.split("@")[0],
              },
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          })
          if (signUpError) throw signUpError

          if (data.session) {
            router.push("/pipeline")
            router.refresh()
          } else {
            setView("confirmation")
          }
        } else {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (signInError) throw signInError
          router.push("/pipeline")
          router.refresh()
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi."
        if (message.includes("Invalid login credentials")) {
          setError("Email atau kata sandi salah.")
        } else if (message.includes("User already registered")) {
          setError("Email sudah terdaftar. Silakan masuk.")
        } else if (message.includes("Password should be")) {
          setError("Kata sandi minimal 6 karakter.")
        } else if (message.includes("rate limit")) {
          setError("Terlalu banyak percobaan. Tunggu beberapa saat.")
        } else {
          setError(message)
        }
      } finally {
        setLoading(false)
      }
    },
    [view, email, password, supabase, router]
  )

  const handleGoogleAuth = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (oauthError) throw oauthError
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk dengan Google.")
      setLoading(false)
    }
  }, [supabase])

  if (view === "confirmation") {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
        <div className="w-full max-w-[340px]">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5">
              <EnvelopeSimple weight="duotone" className="h-7 w-7 text-primary" />
            </div>

            <div className="text-center">
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Cek Email Kamu
              </h1>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                Kami sudah mengirim link konfirmasi ke{" "}
                <span className="font-medium text-foreground">{email}</span>.
                Klik link tersebut untuk mengaktifkan akun kamu.
              </p>
            </div>

            <button
              onClick={() => {
                setView("login")
                setError(null)
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-snappy hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke halaman masuk
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isSignUp = view === "signup"

  return (
    <div className="flex min-h-[100dvh]">
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl" />

        <div className="relative z-10 max-w-[380px] px-8 text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl border border-primary/20 bg-primary/5">
            <Briefcase weight="duotone" className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold tracking-tighter text-foreground">
            Kelola Lamaran Kerja<br />dengan Strategi
          </h2>
          <p className="mt-3 text-[13px] leading-relaxed text-zinc-400">
            Pipeline Kanban, deteksi ghosting otomatis, dan analytics yang bikin
            job hunt kamu lebih terarah dan terukur.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4 text-left">
            <div className="space-y-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800">
                <Kanban weight="bold" className="h-4 w-4 text-zinc-300" />
              </div>
              <p className="text-[11px] font-medium text-foreground">Kanban Board</p>
              <p className="text-[10px] text-zinc-500">Drag & drop pipeline</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800">
                <Ghost weight="bold" className="h-4 w-4 text-zinc-300" />
              </div>
              <p className="text-[11px] font-medium text-foreground">Ghosting Alert</p>
              <p className="text-[10px] text-zinc-500">Deteksi otomatis</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800">
                <ChartBar weight="bold" className="h-4 w-4 text-zinc-300" />
              </div>
              <p className="text-[11px] font-medium text-foreground">Analytics</p>
              <p className="text-[10px] text-zinc-500">Conversion funnel</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-background px-4">
        <div className="w-full max-w-[340px] space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              {isSignUp ? "Buat Akun" : "Masuk ke JejakKarier"}
            </h1>
            <p className="text-[13px] text-muted-foreground">
              {isSignUp
                ? "Mulai kelola pipeline lamaran kerja kamu"
                : "Lanjutkan tracking pipeline lamaran kerja kamu"}
            </p>
          </div>

          {(error || authError) && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2.5">
              <WarningCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <p className="text-xs leading-relaxed text-destructive">
                {error ||
                  (authError === "auth"
                    ? "Autentikasi gagal. Silakan coba lagi."
                    : "")}
              </p>
            </div>
          )}

          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="inline-flex h-9 w-full items-center justify-center gap-2.5 rounded-md border border-border bg-card text-[13px] font-medium text-foreground transition-snappy hover:bg-accent active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          >
            <GoogleIcon />
            Lanjutkan dengan Google
          </button>

          <div className="relative flex items-center">
            <div className="flex-1 border-t border-border" />
            <span className="px-3 text-[11px] text-muted-foreground/50">
              atau
            </span>
            <div className="flex-1 border-t border-border" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-3">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-[12px] font-medium text-muted-foreground"
              >
                Email
              </label>
              <div className="relative">
                <EnvelopeSimple className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError(null)
                  }}
                  required
                  autoComplete="email"
                  className="h-9 w-full rounded-md border border-input bg-transparent pl-8 pr-3 text-[13px] outline-none transition-snappy placeholder:text-muted-foreground/40 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-[12px] font-medium text-muted-foreground"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <LockSimple className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isSignUp ? "Minimal 6 karakter" : "Masukkan kata sandi"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error) setError(null)
                  }}
                  required
                  minLength={6}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  className="h-9 w-full rounded-md border border-input bg-transparent pl-8 pr-9 text-[13px] outline-none transition-snappy placeholder:text-muted-foreground/40 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-snappy hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeSlash className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary text-[13px] font-medium text-primary-foreground transition-snappy hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <SpinnerGap className="h-4 w-4 animate-spin" />
                  {isSignUp ? "Membuat akun..." : "Masuk..."}
                </>
              ) : (
                <>
                  {isSignUp ? (
                    <UserPlus className="h-4 w-4" />
                  ) : (
                    <SignIn className="h-4 w-4" />
                  )}
                  {isSignUp ? "Buat Akun" : "Masuk"}
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[12px] text-muted-foreground">
            {isSignUp ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
            <button
              onClick={() => {
                setView(isSignUp ? "login" : "signup")
                setError(null)
              }}
              className="font-medium text-foreground transition-snappy hover:underline"
            >
              {isSignUp ? "Masuk" : "Daftar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

