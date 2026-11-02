"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Veuillez renseigner votre email et mot de passe." }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Identifiants incorrects. Vérifiez votre email et mot de passe." }
    }
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function signupAction(formData: FormData) {
  const fullName = formData.get("fullName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const password = formData.get("password") as string

  if (!email || !password || !fullName) {
    return { error: "Tous les champs obligatoires doivent être renseignés." }
  }

  if (password.length < 6) {
    return { error: "Le mot de passe doit comporter au moins 6 caractères." }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone || "",
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
