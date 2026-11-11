import { redirect } from "next/navigation"
import { verifyAdminSession, getAdminProducts } from "@/app/actions/admin"
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient"

export const metadata = {
  title: "Administration du Catalogue | LeñaDirecta Scierie",
  description: "Tableau de bord de gestion et synchronisation des produits, descriptions et photos.",
}

// Toujours à jour sans cache statique pour l'administration
export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const { isAdmin, user } = await verifyAdminSession()

  if (!isAdmin) {
    redirect("/admin/login")
  }

  const { products, error } = await getAdminProducts()

  if (error || !products) {
    return (
      <div className="min-h-screen bg-[#121110] text-stone-100 flex items-center justify-center p-4">
        <div className="bg-[#1c1917] border border-rose-900/60 rounded-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-rose-400">Erreur de chargement</h1>
          <p className="text-xs text-stone-400 mt-2">{error || "Impossible de charger les produits."}</p>
        </div>
      </div>
    )
  }

  return (
    <AdminDashboardClient
      initialProducts={products}
      adminEmail={user?.email || "admin@lena-directa.company"}
    />
  )
}
