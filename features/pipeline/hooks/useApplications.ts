"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"
import { MOCK_USER_ID } from "@/lib/mockAuth"

import type { Tables, TablesInsert, TablesUpdate } from "@/types/supabase"

type Application = Tables<"applications">
type ApplicationInsert = TablesInsert<"applications">
type ApplicationUpdate = TablesUpdate<"applications">

// ─── Fetch all applications for mock user ───
export function useApplications() {
  const supabase = createClient()

  return useQuery<Application[]>({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", MOCK_USER_ID)
        .order("position", { ascending: true })
        .order("created_at", { ascending: false })

      if (error) throw error
      return data ?? []
    },
  })
}

// ─── Create application ───
export function useCreateApplication() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      input: Omit<ApplicationInsert, "user_id" | "id">
    ) => {
      const { data, error } = await supabase
        .from("applications")
        .insert({ ...input, user_id: MOCK_USER_ID })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] })
      toast.success("Lamaran berhasil ditambahkan")
    },
    onError: () => {
      toast.error("Gagal menambahkan lamaran")
    },
  })
}

// ─── Update application (with optimistic update for drag-and-drop) ───
export function useUpdateApplication() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: ApplicationUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("applications")
        .update(updates)
        .eq("id", id)
        .eq("user_id", MOCK_USER_ID)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onMutate: async (updatedApp) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["applications"] })

      // Snapshot previous value
      const previousApps = queryClient.getQueryData<Application[]>([
        "applications",
      ])

      // Optimistically update
      queryClient.setQueryData<Application[]>(
        ["applications"],
        (old) =>
          old?.map((app) =>
            app.id === updatedApp.id ? { ...app, ...updatedApp } : app
          ) ?? []
      )

      return { previousApps }
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previousApps) {
        queryClient.setQueryData(["applications"], context.previousApps)
      }
      toast.error("Gagal memperbarui lamaran")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] })
    },
  })
}

// ─── Delete application ───
export function useDeleteApplication() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", id)
        .eq("user_id", MOCK_USER_ID)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] })
      toast.success("Lamaran berhasil dihapus")
    },
    onError: () => {
      toast.error("Gagal menghapus lamaran")
    },
  })
}
