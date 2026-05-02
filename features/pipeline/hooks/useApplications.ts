"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"

import type { Tables, TablesInsert, TablesUpdate } from "@/types/supabase"

type Application = Tables<"applications">
type ApplicationInsert = TablesInsert<"applications">
type ApplicationUpdate = TablesUpdate<"applications">

export function useApplications() {
  const supabase = createClient()

  return useQuery<Application[]>({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id)
        .order("position", { ascending: true })
        .order("created_at", { ascending: false })

      if (error) throw error
      return data ?? []
    },
  })
}

export function useCreateApplication() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      input: Omit<ApplicationInsert, "user_id" | "id">
    ) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("applications")
        .insert({ ...input, user_id: user.id })
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

export function useUpdateApplication() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: ApplicationUpdate & { id: string }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("applications")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onMutate: async (updatedApp) => {
      await queryClient.cancelQueries({ queryKey: ["applications"] })

      const previousApps = queryClient.getQueryData<Application[]>([
        "applications",
      ])

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

export function useDeleteApplication() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)

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