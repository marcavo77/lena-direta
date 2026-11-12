import nodemailer from "nodemailer"

const FROM_EMAIL = process.env.ZOHO_SMTP_USER || "contact@lena-directa.company"
const FROM_NAME = process.env.MAIL_FROM_NAME || "LeñaDirecta Scierie"
const NOTIF_USER = process.env.ZOHO_NOTIF_USER || ""
const NOTIF_PASSWORD = process.env.ZOHO_NOTIF_PASSWORD || ""
const ADMIN_INBOX_EMAIL = process.env.CONTACT_RECEIVER_EMAIL || "contact@lena-directa.company"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lena-directa.company"

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.ZOHO_SMTP_PASSWORD && (process.env.ZOHO_SMTP_USER || FROM_EMAIL))
}

export function isDedicatedNotifSenderConfigured(): boolean {
  return Boolean(NOTIF_USER && NOTIF_PASSWORD)
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function sanitizeHeaderLabel(label: string): string {
  return label.replace(/[\r\n"<>]/g, " ").replace(/\s+/g, " ").trim()
}

function createTransporter(customUser?: string, customPass?: string) {
  const host = process.env.ZOHO_SMTP_HOST || "smtp.zoho.com"
  const port = Number(process.env.ZOHO_SMTP_PORT || "465")
  const user = customUser || process.env.ZOHO_SMTP_USER || FROM_EMAIL
  const pass = customPass || process.env.ZOHO_SMTP_PASSWORD || ""

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  })
}

function wrapEmailLayout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#121110;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#e7e5e4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#121110;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#1c1917;border:1px solid #292524;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:24px 28px;border-bottom:1px solid #292524;background-color:#181615;">
              <span style="font-size:20px;font-weight:900;color:#f5f5f4;letter-spacing:-0.5px;">Leña<span style="color:#f59e0b;">Directa</span></span>
              <span style="display:block;font-size:11px;font-weight:700;color:#a8a29e;text-transform:uppercase;letter-spacing:1.2px;margin-top:4px;">Exploitation Forestière &amp; Scierie • Nangis (77)</span>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px;border-top:1px solid #292524;background-color:#151312;font-size:11px;color:#a8a29e;line-height:1.6;">
              <strong style="color:#e7e5e4;">LeñaDirecta SAS</strong> — Route Forestière de la Scierie, 77370 Nangis<br />
              Email : <a href="mailto:contact@lena-directa.company" style="color:#f59e0b;text-decoration:none;">contact@lena-directa.company</a> • WhatsApp : +34 672 86 83 32<br />
              Site officiel : <a href="${SITE_URL}" style="color:#f59e0b;text-decoration:none;">${SITE_URL}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendMail({
  to,
  subject,
  html,
  text,
  replyTo,
  fromName,
}: {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
  fromName?: string
}): Promise<{ sent: boolean; error?: string }> {
  if (!isSmtpConfigured()) {
    console.warn("[Mailer] ZOHO_SMTP_PASSWORD non configuré — envoi SMTP ignoré pour:", subject)
    return { sent: false, error: "SMTP Zoho non configuré" }
  }

  try {
    const transporter = createTransporter()
    const cleanName = sanitizeHeaderLabel(fromName || FROM_NAME)
    await transporter.sendMail({
      from: `"${cleanName}" <${FROM_EMAIL}>`,
      to,
      replyTo: replyTo || FROM_EMAIL,
      subject,
      text,
      html,
    })
    return { sent: true }
  } catch (err: any) {
    console.error("[Mailer] Erreur SMTP Zoho:", err?.message || err)
    return { sent: false, error: err?.message || "Erreur SMTP" }
  }
}

/**
 * Envoie une notification interne vers la boîte admin (contact@lena-directa.company)
 * avec un nom d'expéditeur dynamique (ex: nom du client pour Contact, type d'alerte pour Virement/Commande).
 * Utilise ZOHO_NOTIF_USER (ex: noreply@lena-directa.company) lorsqu'il est configuré afin
 * que Zoho Webmail affiche exactement `senderLabel` au lieu de "Me".
 */
export async function sendAdminNotificationMail({
  senderLabel,
  replyTo,
  subject,
  html,
  text,
}: {
  senderLabel: string
  replyTo?: string
  subject: string
  html: string
  text: string
}): Promise<{ sent: boolean; error?: string }> {
  if (!isSmtpConfigured() && !isDedicatedNotifSenderConfigured()) {
    return { sent: false, error: "SMTP Zoho non configuré" }
  }

  const cleanLabel = sanitizeHeaderLabel(senderLabel)

  try {
    if (isDedicatedNotifSenderConfigured()) {
      const transporter = createTransporter(NOTIF_USER, NOTIF_PASSWORD)
      await transporter.sendMail({
        from: `"${cleanLabel}" <${NOTIF_USER}>`,
        to: ADMIN_INBOX_EMAIL,
        replyTo: replyTo || ADMIN_INBOX_EMAIL,
        subject,
        text,
        html,
      })
      return { sent: true }
    }

    // Repli si le 2ème compte Zoho (noreply@) n'est pas encore renseigné : plus-addressing
    const [localPart, domainPart] = FROM_EMAIL.split("@")
    const subAddress = domainPart ? `${localPart}+notif@${domainPart}` : FROM_EMAIL
    const transporter = createTransporter()
    await transporter.sendMail({
      from: `"${cleanLabel}" <${subAddress}>`,
      to: ADMIN_INBOX_EMAIL,
      replyTo: replyTo || ADMIN_INBOX_EMAIL,
      subject,
      text,
      html,
    })
    return { sent: true }
  } catch (err: any) {
    console.error("[Mailer] Erreur notification admin:", err?.message || err)
    return { sent: false, error: err?.message || "Erreur SMTP" }
  }
}

export async function sendContactEmails(data: {
  fullName: string
  phone: string
  email: string
  subjectLabel: string
  message: string
}) {
  const safeName = escapeHtml(data.fullName)
  const safePhone = escapeHtml(data.phone)
  const safeEmail = escapeHtml(data.email)
  const safeSubject = escapeHtml(data.subjectLabel)
  const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br />")

  // 1. Notification vers la boîte pro contact@lena-directa.company (affiche le nom du client)
  const adminHtml = wrapEmailLayout(
    `Nouveau message client : ${data.subjectLabel}`,
    `
      <div style="display:inline-block;background-color:#451a03;border:1px solid #d97706;color:#fbbf24;font-size:11px;font-weight:800;padding:4px 10px;border-radius:6px;text-transform:uppercase;margin-bottom:14px;">Nouvelle Demande Site Web</div>
      <h1 style="margin:0 0 16px;font-size:20px;font-weight:800;color:#f5f5f4;">Message de ${safeName}</h1>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#121110;border:1px solid #292524;border-radius:10px;padding:14px;margin-bottom:18px;font-size:13px;">
        <tr><td style="padding:4px 0;color:#a8a29e;width:120px;">Client :</td><td style="padding:4px 0;color:#f5f5f4;font-weight:700;">${safeName}</td></tr>
        <tr><td style="padding:4px 0;color:#a8a29e;">Email :</td><td style="padding:4px 0;color:#f59e0b;font-weight:700;">${safeEmail}</td></tr>
        <tr><td style="padding:4px 0;color:#a8a29e;">Téléphone :</td><td style="padding:4px 0;color:#f5f5f4;font-weight:700;">${safePhone}</td></tr>
        <tr><td style="padding:4px 0;color:#a8a29e;">Objet :</td><td style="padding:4px 0;color:#f5f5f4;">${safeSubject}</td></tr>
      </table>
      <div style="background-color:#121110;border:1px solid #292524;border-radius:10px;padding:16px;font-size:13px;line-height:1.6;color:#d6d3d1;">
        ${safeMessage}
      </div>
      <p style="margin:18px 0 0;font-size:12px;color:#a8a29e;">
        Vous pouvez répondre directement à cet email (Répondre à : ${safeEmail}) ou depuis votre tableau de bord <a href="${SITE_URL}/admin?tab=messages" style="color:#f59e0b;">Admin Scierie</a>.
      </p>
    `
  )

  const adminResult = await sendAdminNotificationMail({
    senderLabel: data.fullName,
    replyTo: data.email,
    subject: `[Contact Site] ${data.subjectLabel} — ${data.fullName}`,
    text: `Nouveau message de ${data.fullName} (${data.email} / ${data.phone})\nObjet : ${data.subjectLabel}\n\n${data.message}`,
    html: adminHtml,
  })

  // 2. Accusé de réception automatique envoyé au client depuis contact@lena-directa.company
  const clientHtml = wrapEmailLayout(
    "Bien reçu : Votre demande chez LeñaDirecta",
    `
      <h1 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#f5f5f4;">Bonjour ${safeName},</h1>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#d6d3d1;">
        Nous avons bien reçu votre demande concernant <strong style="color:#f59e0b;">${safeSubject}</strong>. Un conseiller forestier de notre scierie vous répondra sous 24h ouvrées.
      </p>
      <div style="background-color:#121110;border:1px solid #292524;border-radius:10px;padding:14px;font-size:12px;color:#a8a29e;line-height:1.6;margin-bottom:16px;">
        <strong style="color:#e7e5e4;display:block;margin-bottom:6px;">Récapitulatif de votre message :</strong>
        ${safeMessage}
      </div>
      <p style="margin:0;font-size:12px;color:#a8a29e;line-height:1.6;">
        Besoin d'une réponse urgente ? Écrivez-nous directement sur WhatsApp au <strong style="color:#34d399;">+34 672 86 83 32</strong> ou répondez simplement à cet email.
      </p>
    `
  )

  await sendMail({
    to: data.email,
    subject: "Accusé de réception — Votre message à LeñaDirecta",
    text: `Bonjour ${data.fullName},\n\nNous avons bien reçu votre demande (${data.subjectLabel}). Un conseiller de la scierie vous répondra sous 24h ouvrées.\n\nCordialement,\nLeñaDirecta Scierie`,
    html: clientHtml,
  })

  return adminResult
}

export async function sendAdminContactReplyEmail(data: {
  to: string
  clientName: string
  subjectLabel: string
  originalMessage: string
  replyText: string
}) {
  const safeName = escapeHtml(data.clientName)
  const safeReply = escapeHtml(data.replyText).replace(/\n/g, "<br />")
  const safeOrig = escapeHtml(data.originalMessage).replace(/\n/g, "<br />")

  const html = wrapEmailLayout(
    `Réponse de LeñaDirecta : ${data.subjectLabel}`,
    `
      <h1 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#f5f5f4;">Bonjour ${safeName},</h1>
      <div style="font-size:14px;line-height:1.65;color:#e7e5e4;margin-bottom:22px;">
        ${safeReply}
      </div>
      <div style="border-left:3px solid #d97706;padding-left:12px;font-size:12px;color:#a8a29e;line-height:1.5;">
        <strong style="color:#d6d3d1;display:block;margin-bottom:4px;">Votre message initial (${escapeHtml(data.subjectLabel)}) :</strong>
        ${safeOrig}
      </div>
    `
  )

  return sendMail({
    to: data.to,
    subject: `Re: ${data.subjectLabel} — LeñaDirecta Scierie`,
    text: `Bonjour ${data.clientName},\n\n${data.replyText}\n\n---\nVotre message initial :\n${data.originalMessage}\n\nLeñaDirecta Scierie\ncontact@lena-directa.company`,
    html,
  })
}

export async function sendOrderCreatedEmails(data: {
  orderId: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  totalFormatted: string
  items: Array<{ name: string; quantity: number; totalFormatted: string }>
}) {
  const safeName = escapeHtml(data.customerName)
  const itemsRows = data.items
    .map(
      (it) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #292524;color:#e7e5e4;">${escapeHtml(it.name)} (x${it.quantity})</td><td align="right" style="padding:8px 0;border-bottom:1px solid #292524;color:#f59e0b;font-weight:700;">${escapeHtml(it.totalFormatted)}</td></tr>`
    )
    .join("")

  const confirmUrl = `${SITE_URL}/confirmation/${data.orderId}`

  const clientHtml = wrapEmailLayout(
    `Confirmation de commande ${data.orderNumber}`,
    `
      <h1 style="margin:0 0 10px;font-size:20px;font-weight:800;color:#f5f5f4;">Merci pour votre commande, ${safeName} !</h1>
      <p style="margin:0 0 18px;font-size:13px;line-height:1.6;color:#d6d3d1;">
        Votre commande <strong style="color:#f59e0b;font-family:monospace;">${escapeHtml(data.orderNumber)}</strong> a bien été enregistrée à la scierie.
      </p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:13px;margin-bottom:18px;">
        ${itemsRows}
        <tr>
          <td style="padding:12px 0 0;font-weight:800;color:#f5f5f4;font-size:15px;">Total TTC</td>
          <td align="right" style="padding:12px 0 0;font-weight:900;color:#f59e0b;font-size:16px;">${escapeHtml(data.totalFormatted)}</td>
        </tr>
      </table>
      <div style="background-color:#121110;border:1px solid #d97706;border-radius:12px;padding:16px;font-size:12px;line-height:1.6;margin-bottom:18px;">
        <strong style="color:#f59e0b;display:block;margin-bottom:6px;text-transform:uppercase;">Coordonnées Bancaires (RIB) pour le virement :</strong>
        Titulaire : <strong style="color:#f5f5f4;">LEÑADIRECTA SAS</strong><br />
        Banque : Crédit Agricole d'Île-de-France<br />
        IBAN : <strong style="color:#f59e0b;font-family:monospace;">FR76 1027 8000 0000 1234 5678 901</strong><br />
        BIC : <strong style="color:#f5f5f4;font-family:monospace;">AGRIFRPP</strong><br />
        Référence obligatoire : <strong style="color:#f5f5f4;font-family:monospace;">${escapeHtml(data.orderNumber)}</strong>
      </div>
      <div style="text-align:center;">
        <a href="${confirmUrl}" style="display:inline-block;background-color:#f59e0b;color:#0c0a09;font-weight:900;font-size:12px;text-decoration:none;padding:12px 22px;border-radius:10px;text-transform:uppercase;">Suivre ma commande / Signaler mon virement</a>
      </div>
    `
  )

  await sendMail({
    to: data.customerEmail,
    subject: `Commande ${data.orderNumber} enregistrée — LeñaDirecta`,
    text: `Merci ${data.customerName} ! Votre commande ${data.orderNumber} (${data.totalFormatted}) est enregistrée. Consultez votre suivi et le RIB ici : ${confirmUrl}`,
    html: clientHtml,
  })

  // Notification interne vers contact@lena-directa.company (affiche "Nouvelle Commande • Nom Client")
  await sendAdminNotificationMail({
    senderLabel: `Nouvelle Commande • ${data.customerName}`,
    replyTo: data.customerEmail,
    subject: `[Commande ${data.orderNumber}] ${data.totalFormatted} — ${data.customerName}`,
    text: `Nouvelle commande ${data.orderNumber} passée par ${data.customerName} (${data.customerEmail} / ${data.customerPhone}) pour un total de ${data.totalFormatted}. Consultez ${SITE_URL}/admin`,
    html: wrapEmailLayout(
      `Nouvelle commande ${data.orderNumber}`,
      `<div style="display:inline-block;background-color:#451a03;border:1px solid #d97706;color:#fbbf24;font-size:11px;font-weight:800;padding:4px 10px;border-radius:6px;text-transform:uppercase;margin-bottom:14px;">Nouvelle Commande</div>
       <h2 style="margin:0 0 12px;color:#f59e0b;">Commande ${escapeHtml(data.orderNumber)}</h2>
       <p style="font-size:13px;color:#d6d3d1;">Client : <strong>${safeName}</strong> (${escapeHtml(data.customerEmail)} / ${escapeHtml(data.customerPhone)})</p>
       <p style="font-size:15px;color:#f5f5f4;">Montant total : <strong style="color:#f59e0b;">${escapeHtml(data.totalFormatted)}</strong></p>
       <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:12px;margin:14px 0;">${itemsRows}</table>
       <p style="margin-top:16px;"><a href="${SITE_URL}/admin?tab=orders" style="display:inline-block;background-color:#f59e0b;color:#0c0a09;font-weight:900;font-size:12px;text-decoration:none;padding:10px 18px;border-radius:8px;text-transform:uppercase;">Ouvrir le Tableau de Bord Admin →</a></p>`
    ),
  })
}

export async function sendTransferNotifiedAdminEmail(data: {
  orderNumber: string
  customerName: string
  customerEmail: string
  totalFormatted: string
  reference?: string
}) {
  const safeName = escapeHtml(data.customerName)
  const safeRef = data.reference ? escapeHtml(data.reference) : null

  return sendAdminNotificationMail({
    senderLabel: `Virement Signalé • ${data.customerName}`,
    replyTo: data.customerEmail,
    subject: `[Virement Signalé] Commande ${data.orderNumber} (${data.totalFormatted})`,
    text: `${data.customerName} (${data.customerEmail}) vient de signaler que le virement de ${data.totalFormatted} pour la commande ${data.orderNumber} a été effectué.\n${data.reference ? `Référence : ${data.reference}\n` : ""}Vérifiez et validez sur : ${SITE_URL}/admin?tab=orders`,
    html: wrapEmailLayout(
      `Virement signalé — ${data.orderNumber}`,
      `
        <div style="display:inline-block;background-color:#451a03;border:1px solid #d97706;color:#fbbf24;font-size:11px;font-weight:800;padding:4px 10px;border-radius:6px;text-transform:uppercase;margin-bottom:14px;">Virement À Vérifier</div>
        <h1 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#f5f5f4;">Virement signalé par ${safeName}</h1>
        <p style="margin:0 0 16px;font-size:13px;line-height:1.6;color:#d6d3d1;">
          Le client a cliqué sur le bouton confirmant l'envoi du virement pour la commande <strong style="color:#f59e0b;font-family:monospace;">${escapeHtml(data.orderNumber)}</strong> d'un montant de <strong style="color:#f5f5f4;">${escapeHtml(data.totalFormatted)}</strong>.
        </p>
        ${safeRef ? `<p style="margin:0 0 16px;font-size:13px;color:#e7e5e4;">Référence indiquée : <strong style="color:#f59e0b;">${safeRef}</strong></p>` : ""}
        <a href="${SITE_URL}/admin?tab=orders" style="display:inline-block;background-color:#10b981;color:#ffffff;font-weight:900;font-size:12px;text-decoration:none;padding:12px 22px;border-radius:10px;text-transform:uppercase;">Vérifier et Valider le Virement →</a>
      `
    ),
  })
}

export async function sendOrderStatusUpdateEmail(data: {
  orderId: string
  orderNumber: string
  customerName: string
  customerEmail: string
  newStatus: string
}) {
  const statusLabels: Record<string, { title: string; msg: string }> = {
    paid: {
      title: "Paiement validé !",
      msg: "Votre virement bancaire a été constaté et validé par notre scierie. Vos palettes passent en préparation.",
    },
    preparing: {
      title: "Commande en cours de préparation",
      msg: "Nos équipes préparent et contrôlent le taux d'humidité de votre bois sous hangar ventilé.",
    },
    out_for_delivery: {
      title: "Commande en cours de livraison",
      msg: "Votre commande a quitté notre exploitation. Notre chauffeur vous contactera avant la dépose.",
    },
    delivered: {
      title: "Commande livrée",
      msg: "Votre commande a bien été livrée. Merci pour votre confiance envers LeñaDirecta !",
    },
  }

  const info = statusLabels[data.newStatus]
  if (!info) return { sent: false }

  const trackUrl = `${SITE_URL}/confirmation/${data.orderId}`
  const html = wrapEmailLayout(
    `${info.title} — ${data.orderNumber}`,
    `
      <h1 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#f5f5f4;">Bonjour ${escapeHtml(data.customerName)},</h1>
      <p style="margin:0 0 14px;font-size:14px;color:#f59e0b;font-weight:800;">${escapeHtml(info.title)}</p>
      <p style="margin:0 0 20px;font-size:13px;line-height:1.6;color:#d6d3d1;">
        ${escapeHtml(info.msg)}
      </p>
      <a href="${trackUrl}" style="display:inline-block;background-color:#f59e0b;color:#0c0a09;font-weight:900;font-size:12px;text-decoration:none;padding:12px 22px;border-radius:10px;text-transform:uppercase;">Consulter mon suivi de commande</a>
    `
  )

  return sendMail({
    to: data.customerEmail,
    subject: `[LeñaDirecta] ${info.title} — Commande ${data.orderNumber}`,
    text: `Bonjour ${data.customerName},\n\n${info.title}\n${info.msg}\n\nSuivi : ${trackUrl}`,
    html,
  })
}

export async function sendSignupEmails(data: {
  fullName: string
  email: string
  phone?: string
}) {
  const safeName = escapeHtml(data.fullName)
  const safeEmail = escapeHtml(data.email)
  const safePhone = escapeHtml(data.phone || "Non renseigné")

  // 1. Email de bienvenue personnalisé au nouvel utilisateur
  const clientHtml = wrapEmailLayout(
    "Bienvenue chez LeñaDirecta Scierie !",
    `
      <div style="display:inline-block;background-color:#064e3b;border:1px solid #10b981;color:#34d399;font-size:11px;font-weight:800;padding:4px 10px;border-radius:6px;text-transform:uppercase;margin-bottom:14px;">Compte Client Activé</div>
      <h1 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#f5f5f4;">Bienvenue à la scierie, ${safeName} !</h1>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#d6d3d1;">
        Votre espace personnel <strong style="color:#f59e0b;">LeñaDirecta</strong> est maintenant créé et actif. Vous pouvez désormais suivre vos commandes en temps réel, consulter nos coordonnées bancaires officielles et gérer vos livraisons à domicile.
      </p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#121110;border:1px solid #292524;border-radius:10px;padding:14px;margin-bottom:20px;font-size:13px;">
        <tr><td style="padding:4px 0;color:#a8a29e;width:130px;">Titulaire :</td><td style="padding:4px 0;color:#f5f5f4;font-weight:700;">${safeName}</td></tr>
        <tr><td style="padding:4px 0;color:#a8a29e;">Identifiant email :</td><td style="padding:4px 0;color:#f59e0b;font-weight:700;">${safeEmail}</td></tr>
        <tr><td style="padding:4px 0;color:#a8a29e;">Téléphone :</td><td style="padding:4px 0;color:#f5f5f4;">${safePhone}</td></tr>
      </table>
      <div style="text-align:center;">
        <a href="${SITE_URL}/mon-compte" style="display:inline-block;background-color:#f59e0b;color:#0c0a09;font-weight:900;font-size:12px;text-decoration:none;padding:12px 22px;border-radius:10px;text-transform:uppercase;margin-right:8px;">Accéder à Mon Compte</a>
        <a href="${SITE_URL}/catalogue" style="display:inline-block;background-color:#292524;color:#f5f5f4;font-weight:700;font-size:12px;text-decoration:none;padding:12px 18px;border-radius:10px;border:1px solid #44403c;">Voir le Catalogue</a>
      </div>
    `
  )

  await sendMail({
    to: data.email,
    subject: `Bienvenue chez LeñaDirecta, ${data.fullName} !`,
    text: `Bonjour ${data.fullName},\n\nVotre compte client LeñaDirecta est créé avec succès (${data.email}). Accédez à votre espace ici : ${SITE_URL}/mon-compte`,
    html: clientHtml,
  })

  // 2. Notification personnalisée à l'Administrateur (affiche "Nouveau Client • Nom")
  const adminHtml = wrapEmailLayout(
    `Nouvelle inscription client : ${data.fullName}`,
    `
      <div style="display:inline-block;background-color:#451a03;border:1px solid #d97706;color:#fbbf24;font-size:11px;font-weight:800;padding:4px 10px;border-radius:6px;text-transform:uppercase;margin-bottom:14px;">Nouvelle Inscription Client</div>
      <h1 style="margin:0 0 14px;font-size:20px;font-weight:800;color:#f5f5f4;">${safeName} vient de créer un compte</h1>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#121110;border:1px solid #292524;border-radius:10px;padding:14px;margin-bottom:20px;font-size:13px;">
        <tr><td style="padding:4px 0;color:#a8a29e;width:130px;">Nom complet :</td><td style="padding:4px 0;color:#f5f5f4;font-weight:700;">${safeName}</td></tr>
        <tr><td style="padding:4px 0;color:#a8a29e;">Email :</td><td style="padding:4px 0;color:#f59e0b;font-weight:700;">${safeEmail}</td></tr>
        <tr><td style="padding:4px 0;color:#a8a29e;">Téléphone :</td><td style="padding:4px 0;color:#f5f5f4;font-weight:700;">${safePhone}</td></tr>
        <tr><td style="padding:4px 0;color:#a8a29e;">Date :</td><td style="padding:4px 0;color:#d6d3d1;">${new Date().toLocaleString("fr-FR")}</td></tr>
      </table>
      <a href="${SITE_URL}/admin?tab=customers" style="display:inline-block;background-color:#f59e0b;color:#0c0a09;font-weight:900;font-size:12px;text-decoration:none;padding:12px 22px;border-radius:10px;text-transform:uppercase;">Voir la fiche client dans l'Admin →</a>
    `
  )

  await sendAdminNotificationMail({
    senderLabel: `Nouveau Client • ${data.fullName}`,
    replyTo: data.email,
    subject: `[Nouveau Client] ${data.fullName} (${data.email})`,
    text: `Un nouveau client vient de s'inscrire :\nNom : ${data.fullName}\nEmail : ${data.email}\nTéléphone : ${data.phone || "Non renseigné"}\n\nConsultez ${SITE_URL}/admin?tab=customers`,
    html: adminHtml,
  })
}
