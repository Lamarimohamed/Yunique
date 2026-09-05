import { useState, useEffect } from "react"
import { useData, Product, Order } from "../../context/DataContext"
import { Package, ShoppingBag, Plus, Edit2, Trash2, Download, TrendingUp, DollarSign } from "lucide-react"
import ProductModal from "../../components/admin/ProductModal"
import OrderModal from "../../components/admin/OrderModal"
import { Link } from "react-router"
import { supabase } from "../../lib/supabase"

const adminStatusCache = new Map<string, boolean>()

async function isAdminUser(userId: string, appMetadataRole?: string): Promise<boolean> {
  if (appMetadataRole === "admin") return true
  const cached = adminStatusCache.get(userId)
  if (cached !== undefined) return cached

  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", userId)
      .limit(1)
      .maybeSingle()

    if (error) {
      console.warn("admin_users table check failed (run SQL migration?)", error)
      adminStatusCache.set(userId, false)
      return false
    }
    const isAdmin = Boolean(data)
    adminStatusCache.set(userId, isAdmin)
    return isAdmin
  } catch (e) {
    console.error("admin check error", e)
    return false
  }
}

const STATUSES: { value: Order["status"]; label: string; cls: string }[] = [
  { value: "Pending",   label: "Pending",   cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { value: "Shipped",   label: "Shipped",   cls: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "Delivered", label: "Delivered", cls: "bg-green-50 text-green-700 border-green-200" },
  { value: "Cancelled", label: "Cancelled", cls: "bg-red-50 text-red-700 border-red-200" },
]
const statusCls = (s: Order["status"]) => STATUSES.find(x => x.value === s)?.cls ?? STATUSES[0].cls

export default function AdminDashboard() {
  const { products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus, deleteOrder } = useData()
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products")
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Order Modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

  // ⭐ Persist admin login across page refreshes
  useEffect(() => {
    let cancelled = false
    async function checkExistingSession() {
      try {
        const { data } = await supabase.auth.getSession()
        const u = data.session?.user
        if (u && (await isAdminUser(u.id, u.app_metadata?.role))) {
          if (!cancelled) setIsAuthenticated(true)
        }
      } catch (e) {
        console.warn("session check failed", e)
      } finally {
        if (!cancelled) setCheckingSession(false)
      }
    }
    checkExistingSession()

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, s) => {
      if (event === "SIGNED_OUT" || event === "USER_DELETED") {
        setIsAuthenticated(false)
        return
      }
      if (s?.user) {
        const ok = await isAdminUser(s.user.id, s.user.app_metadata?.role)
        setIsAuthenticated(ok)
        if (!ok) await supabase.auth.signOut()
      }
    })
    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setLoginError("")
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login error:", error)
      setLoginError(error.message)
    } else if (data.user) {
      const ok = await isAdminUser(data.user.id, data.user.app_metadata?.role)
      if (!ok) {
        await supabase.auth.signOut()
        setLoginError("This account is not authorized as an admin.")
      } else {
        setIsAuthenticated(true)
      }
    }
    setIsLoggingIn(false)
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleSaveProduct = (product: Omit<Product, "id">) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, product)
    } else {
      addProduct(product)
    }
  }

  const exportOrdersToCSV = () => {
    const headers = ["Order ID", "Date", "Customer Name", "Phone", "Delivery Type", "Wilaya", "Commune", "Home Address", "Total", "Status", "Items"]
    const rows = orders.map(order => {
      const itemsStr = order.items.map(i => `${i.name} (${i.quantity}x ${i.size})`).join(" | ")
      return [
        order.id,
        new Date(order.date).toLocaleDateString(),
        `"${order.customerName}"`,
        order.phone,
        order.deliveryType === "domicile" ? "Home Delivery" : "Stop Desk",
        `"${order.wilaya}"`,
        `"${order.commune}"`,
        `"${order.address}"`,
        order.total,
        order.status,
        `"${itemsStr}"`
      ].join(",")
    })
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "yunique_orders.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] pt-24 flex items-center justify-center p-6 text-black">
        <div className="bg-white p-10 max-w-md w-full border border-[#E5E5E5] shadow-sm">
          <h1 className="text-2xl font-display tracking-widest uppercase mb-2 text-center text-black">
            Admin Portal
          </h1>
          <p className="text-xs font-sans tracking-widest text-center text-gray-500 mb-8 uppercase">
            Sign in to continue
          </p>
          
          {loginError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold tracking-widest text-center uppercase">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                Email Address
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-4 bg-[#F9F9F9] border border-[#E5E5E5] text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                placeholder="Enter admin email"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                Password
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-4 bg-[#F9F9F9] border border-[#E5E5E5] text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className={`w-full py-4 text-xs font-semibold tracking-widest uppercase transition-colors ${
                isLoggingIn ? "bg-gray-200 text-gray-500" : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {isLoggingIn ? "Verifying..." : "Sign In"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 hover:text-black transition-colors underline underline-offset-4">
              Return to Store
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // --- DASHBOARD SCREEN ---
  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-24 pb-12 text-black">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex justify-between items-end mb-8 border-b border-[#E5E5E5] pb-6">
          <div>
            <h1 className="text-3xl font-display tracking-widest uppercase text-black">
              Admin Portal
            </h1>
            <p className="text-sm font-sans tracking-wide text-gray-500 mt-2">
              Manage your products and orders
            </p>
          </div>
          <button 
            onClick={async () => {
              await supabase.auth.signOut()
              setIsAuthenticated(false)
            }} 
            className="text-xs font-semibold tracking-widest uppercase text-black hover:text-gray-500 transition-colors border border-black px-4 py-2 hover:border-gray-500"
          >
            Sign Out
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 border border-[#E5E5E5] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-display tracking-widest">{totalRevenue.toLocaleString()} DZD</p>
            </div>
            <div className="bg-[#F9F9F9] p-3 rounded-full text-black"><DollarSign size={20} /></div>
          </div>
          <div className="bg-white p-6 border border-[#E5E5E5] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-1">Total Orders</p>
              <p className="text-2xl font-display tracking-widest">{totalOrders}</p>
            </div>
            <div className="bg-[#F9F9F9] p-3 rounded-full text-black"><ShoppingBag size={20} /></div>
          </div>
          <div className="bg-white p-6 border border-[#E5E5E5] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-1">Avg. Order Value</p>
              <p className="text-2xl font-display tracking-widest">{avgOrderValue.toLocaleString()} DZD</p>
            </div>
            <div className="bg-[#F9F9F9] p-3 rounded-full text-black"><TrendingUp size={20} /></div>
          </div>
        </div>

        <div className="flex space-x-8 mb-8 border-b border-[#E5E5E5]">
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-4 text-sm font-semibold tracking-widest uppercase transition-colors relative ${
              activeTab === "products" ? "text-black" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="flex items-center gap-2"><Package size={16} /> Products</span>
            {activeTab === "products" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 text-sm font-semibold tracking-widest uppercase transition-colors relative ${
              activeTab === "orders" ? "text-black" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="flex items-center gap-2"><ShoppingBag size={16} /> Orders</span>
            {activeTab === "orders" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
            )}
          </button>
        </div>

        {activeTab === "products" && (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>
            
            <div className="bg-white border border-[#E5E5E5] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
                    <th className="p-4 text-[10px] font-semibold tracking-widest uppercase text-gray-500">Image</th>
                    <th className="p-4 text-[10px] font-semibold tracking-widest uppercase text-gray-500">Name</th>
                    <th className="p-4 text-[10px] font-semibold tracking-widest uppercase text-gray-500">Price</th>
                    <th className="p-4 text-[10px] font-semibold tracking-widest uppercase text-gray-500">Sizes</th>
                    <th className="p-4 text-[10px] font-semibold tracking-widest uppercase text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b border-[#E5E5E5] last:border-0 hover:bg-[#F9F9F9] transition-colors">
                      <td className="p-4">
                        <img src={product.image} alt={product.name} className="w-12 h-16 object-cover bg-[#F2F2F0]" />
                      </td>
                      <td className="p-4 text-sm font-semibold uppercase tracking-wider">
                        {product.name}
                        {product.isDraft && <span className="ml-2 inline-block bg-yellow-400 text-yellow-900 text-[8px] px-1.5 py-0.5 align-middle font-bold">DRAFT</span>}
                        {product.isNew && !product.isDraft && <span className="ml-2 inline-block bg-black text-white text-[8px] px-1.5 py-0.5 align-middle">NEW</span>}
                        {product.collection && <span className="block mt-1 text-[10px] text-gray-500 font-sans tracking-widest">{product.collection}</span>}
                      </td>
                      <td className="p-4 text-sm font-sans tracking-widest">{product.price.toLocaleString()} DZD</td>
                      <td className="p-4 text-xs font-sans text-gray-500">{product.sizes.join(", ")}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-4">
                          <button onClick={() => openEditModal(product)} className="text-gray-400 hover:text-black transition-colors" aria-label="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => deleteProduct(product.id)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-sm font-semibold tracking-widest text-gray-500 uppercase">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={exportOrdersToCSV}
                className="flex items-center gap-2 bg-white border border-[#E5E5E5] text-black px-6 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-[#F9F9F9] transition-colors"
              >
                <Download size={16} /> Export CSV
              </button>
            </div>
            <div className="bg-white border border-[#E5E5E5] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
                    <th className="p-4 text-[10px] font-semibold tracking-widest uppercase text-gray-500">Order ID</th>
                    <th className="p-4 text-[10px] font-semibold tracking-widest uppercase text-gray-500">Customer</th>
                    <th className="p-4 text-[10px] font-semibold tracking-widest uppercase text-gray-500">Date</th>
                    <th className="p-4 text-[10px] font-semibold tracking-widest uppercase text-gray-500">Total</th>
                    <th className="p-4 text-[10px] font-semibold tracking-widest uppercase text-gray-500">Status</th>
                    <th className="p-4 text-[10px] font-semibold tracking-widest uppercase text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-[#E5E5E5] last:border-0 hover:bg-[#F9F9F9] transition-colors">
                      <td className="p-4 text-sm font-semibold tracking-widest">{order.id}</td>
                      <td className="p-4">
                        <p className="text-sm font-semibold uppercase">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.phone} · {order.wilaya}</p>
                      </td>
                      <td className="p-4 text-xs font-sans text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="p-4 text-sm font-sans tracking-widest">{order.total.toLocaleString()} DZD</td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className={`text-xs font-semibold tracking-widest uppercase p-2 border focus:outline-none cursor-pointer ${
                            order.status === "Pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                            order.status === "Shipped" ? "bg-blue-50 text-blue-700 border-blue-200" :
                            "bg-green-50 text-green-700 border-green-200"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setIsOrderModalOpen(true)
                          }}
                          className="text-xs font-semibold tracking-widest uppercase text-gray-500 hover:text-black underline underline-offset-4"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete order ${order.id}?`)) {
                              deleteOrder(order.id)
                            }
                          }}
                          className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label={`Delete order ${order.id}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-sm font-semibold tracking-widest text-gray-500 uppercase">
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  )
}