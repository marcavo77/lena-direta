"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase()
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
  const fullName = (formData.get("fullName") as string)?.trim()
  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const phone = (formData.get("phone") as string)?.trim()
  const password = formData.get("password") as string

  if (!email || !password || !fullName) {
    return { error: "Tous les champs obligatoires doivent être renseignés." }
  }

  if (password.length < 6) {
    return { error: "Le mot de passe doit comporter au moins 6 caractères." }
  }

  const supabase = await createClient()

  // Création du compte utilisateur dans Supabase Auth
  const { data, error } = await supabase.auth.signUp({
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

  // Enregistrement synchronisé direct dans la table profiles
  if (data?.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      email: email,
      full_name: fullName,
      phone: phone || "",
    })

    // Tentative de connexion immédiate si l'email n'a pas besoin de confirmation stricte
    await supabase.auth.signInWithPassword({
      email,
      password,
    })
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

export async function getUserProfileAndOrders() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Récupération des commandes associées soit au user_id soit au customer_email
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
    .order("created_at", { ascending: false })

  return {
    user,
    profile: profile || {
      id: user.id,
      email: user.email!,
      full_name: (user.user_metadata?.full_name as string) || "",
      phone: (user.user_metadata?.phone as string) || "",
      shipping_address: null,
      created_at: user.created_at,
      updated_at: user.created_at,
    },
    orders: orders || [],
  }
}

export async function updateProfileAction(formData: FormData) {
  const fullName = (formData.get("fullName") as string)?.trim()
  const phone = (formData.get("phone") as string)?.trim()
  const street = (formData.get("street") as string)?.trim()
  const postalCode = (formData.get("postalCode") as string)?.trim()
  const city = (formData.get("city") as string)?.trim()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non connecté" }
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email!,
    full_name: fullName,
    phone: phone,
    shipping_address: {
      street,
      postal_code: postalCode,
      city,
    },
    updated_at: new Date().toISOString(),
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/mon-compte")
  return { success: true }
}
