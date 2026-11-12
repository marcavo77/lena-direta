"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendContactEmails } from "@/lib/email/mailer"

const SUBJECT_LABELS: Record<string, string> = {
  conseil: "Conseil de cubage / Choix de combustible",
  livraison: "Question sur la livraison et l'accès camion 19T",
  virement: "Information sur le paiement par Virement Bancaire (RIB)",
  devis: "Demande de devis gros volume (copropriété, pro)",
  autre: "Autre demande",
}

const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Veuillez indiquer votre nom complet (minimum 2 caractères)."),
  phone: z.string().trim().min(8, "Veuillez indiquer un numéro de téléphone valide."),
  email: z.string().trim().email("Veuillez indiquer une adresse email valide."),
  subject: z.string().trim().min(2, "Veuillez sélectionner l'objet de votre demande."),
  message: z.string().trim().min(10, "Votre message doit contenir au moins 10 caractères."),
})

export async function submitContactMessageAction(formData: {
  fullName: string
  phone: string
  email: string
  subject: string
  message: string
}) {
  try {
    const parsed = contactSchema.safeParse(formData)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Formulaire invalide.",
      }
    }

    const { fullName, phone, email, subject, message } = parsed.data
    const subjectLabel = SUBJECT_LABELS[subject] || subject

    const adminSupabase = createAdminClient()

    const { data: inserted, error: insertErr } = await adminSupabase
      .from("contact_messages")
      .insert({
        full_name: fullName,
        phone,
        email,
        subject: subjectLabel,
        message,
        status: "new",
        email_dispatched: false,
      })
      .select("id")
      .single()

    if (insertErr || !inserted) {
      console.error("Erreur insertion message contact:", insertErr)
      return {
        success: false,
        error: "Impossible d'enregistrer votre message pour le moment. Réessayez ou contactez-nous sur WhatsApp.",
      }
    }

    // Tentative d'envoi via Zoho Mail SMTP (contact@lena-directa.company)
    const mailResult = await sendContactEmails({
      fullName,
      phone,
      email,
      subjectLabel,
      message,
    })

    if (mailResult.sent) {
      await adminSupabase
        .from("contact_messages")
        .update({ email_dispatched: true })
        .eq("id", inserted.id)
    }

    revalidatePath("/admin")

    return {
      success: true,
      emailSent: mailResult.sent,
    }
  } catch (err) {
    console.error("submitContactMessageAction error:", err)
    return {
      success: false,
      error: "Une erreur inattendue est survenue lors de l'envoi.",
    }
  }
}
