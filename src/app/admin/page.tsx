import { redirect } from "next/navigation"
import { verifyAdminSession, getAdminDashboardData } from "@/app/actions/admin"
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient"

export const metadata = {
  title: "Administration Scierie | LeñaDirecta",
  description: "Tableau de bord de gestion des produits, clients, paiements par virement et livraisons.",
}

// Toujours à jour sans cache statique pour l'administration
export const dynamic = "force-dynamic"

interface AdminPageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { isAdmin, user } = await verifyAdminSession()

  if (!isAdmin) {
    redirect("/admin/login")
  }

  const resolvedParams = await searchParams
  const rawTab = resolvedParams?.tab
  const initialTab =
    rawTab === "customers" || rawTab === "products" || rawTab === "orders" || rawTab === "messages"
      ? rawTab
      : "orders"

  const { data, error } = await getAdminDashboardData()

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#121110] text-stone-100 flex items-center justify-center p-4">
        <div className="bg-[#1c1917] border border-rose-900/60 rounded-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-rose-400">Erreur de chargement</h1>
          <p className="text-xs text-stone-400 mt-2">{error || "Impossible de charger les données d'administration."}</p>
        </div>
      </div>
    )
  }

  return (
    <AdminDashboardClient
      initialProducts={data.products}
      initialOrders={data.orders}
      initialCustomers={data.customers}
      initialContactMessages={data.contactMessages}
      smtpConfigured={data.smtpConfigured}
      initialStats={data.stats}
      initialTab={initialTab}
      adminEmail={user?.email || "admin@lena-directa.company"}
    />
  )
}
