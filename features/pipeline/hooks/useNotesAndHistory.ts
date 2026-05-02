"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"

import type { Tables } from "@/types/supabase"

type Note = Tables<"notes">
type StatusHistory = Tables<"status_history">

// ─── Fetch notes for a specific application ───
export function useNotes(applicationId: string | null) {
  const supabase = createClient()

  return useQuery<Note[]>({
    queryKey: ["notes", applicationId],
    enabled: !!applicationId,
    queryFn: async () => {
      if (!applicationId) return []

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("application_id", applicationId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data ?? []
    },
  })
}

// ─── Create a note ───
export function useCreateNote() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      applicationId,
      content,
    }: {
      applicationId: string
      content: string
    }) => {
      const { data, error } = await supabase
        .from("notes")
        .insert({
          application_id: applicationId,
          content,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", variables.applicationId],
      })
      toast.success("Catatan ditambahkan")
    },
    onError: () => {
      toast.error("Gagal menambahkan catatan")
    },
  })
}

// ─── Delete a note ───
export function useDeleteNote() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      noteId,
      applicationId,
    }: {
      noteId: string
      applicationId: string
    }) => {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId)

      if (error) throw error
      return { applicationId }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", data.applicationId],
      })
      toast.success("Catatan dihapus")
    },
    onError: () => {
      toast.error("Gagal menghapus catatan")
    },
  })
}

// ─── Fetch status history for a specific application ───
export function useStatusHistory(applicationId: string | null) {
  const supabase = createClient()

  return useQuery<StatusHistory[]>({
    queryKey: ["status_history", applicationId],
    enabled: !!applicationId,
    queryFn: async () => {
      if (!applicationId) return []

      const { data, error } = await supabase
        .from("status_history")
        .select("*")
        .eq("application_id", applicationId)
        .order("changed_at", { ascending: false })

      if (error) throw error
      return data ?? []
    },
  })
}
