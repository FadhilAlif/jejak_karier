"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Briefcase, Envelope, Lock, Eye, EyeSlash } from "@phosphor-icons/react"

import { createClient } from "@/lib/supabase/client"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmationSent, setConfirmationSent] = useState(false)

  const authError = searchParams.get("error")

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (signUpError) throw signUpError

        if (data.session) {
          router.push("/pipeline")
          router.refresh()
        } else {
          setConfirmationSent(true)
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
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleAuth() {
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
  }

  if (confirmationSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-xs space-y-4 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Briefcase weight="duotone" className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Cek Email Kamu
          </h2>
          <p className="text-xs text-muted-foreground">
            Kami sudah mengirim link konfirmasi ke{" "}
            <span className="text-foreground">{email}</span>. Silakan klik link
            tersebut untuk mengaktifkan akun.
          </p>
          <button
            onClick={() => {
              setConfirmationSent(false)
              setIsSignUp(false)
            }}
            className="text-xs text-muted-foreground transition-snappy hover:text-foreground"
          >
            Kembali ke halaman masuk
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-xs space-y-6">
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

        {(error || authError) && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error ||
              (authError === "auth"
                ? "Autentikasi gagal. Silakan coba lagi."
                : "")}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-3">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs text-muted-foreground"
            >
              Email
            </label>
            <div className="relative">
              <Envelope className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                type="email"
                placeholder="kamu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-8 w-full rounded-none border border-input bg-transparent pl-8 pr-2.5 text-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs text-muted-foreground"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-8 w-full rounded-none border border-input bg-transparent pl-8 pr-8 text-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-snappy hover:text-foreground"
              >
                {showPassword ? (
                  <EyeSlash className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-8 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground transition-snappy hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Memproses..." : isSignUp ? "Daftar" : "Masuk"}
          </button>
        </form>

        <div className="relative flex items-center">
          <div className="flex-1 border-t border-border" />
          <span className="px-2 text-[10px] text-muted-foreground">atau</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="inline-flex h-8 w-full items-center justify-center gap-2 rounded-md border border-border bg-card text-xs font-medium text-foreground transition-snappy hover:bg-accent disabled:opacity-50"
        >
          <GoogleIcon />
          Lanjutkan dengan Google
        </button>

        <p className="text-center text-[11px] text-muted-foreground">
          {isSignUp ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
            }}
            className="text-foreground transition-snappy hover:underline"
          >
            {isSignUp ? "Masuk" : "Daftar"}
          </button>
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
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