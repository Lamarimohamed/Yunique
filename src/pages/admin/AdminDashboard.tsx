import { useState } from "react"
import { useData, Product } from "../../context/DataContext"
import { Package, ShoppingBag, Plus, Edit2, Trash2 } from "lucide-react"
import ProductModal from "../../components/admin/ProductModal"
import { Link } from "react-router"

export default function AdminDashboard() {
  const { products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useData()
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products")
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

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

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-24 pb-12">
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
          <Link to="/" className="text-xs font-semibold tracking-widest uppercase text-black hover:text-gray-500 transition-colors">
            Return to Store
          </Link>
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
                      <td className="p-4 text-sm font-semibold uppercase tracking-wider">{product.name}</td>
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
            <div className="bg-white border border-[#E5E5E5] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
                    <th className="p-4 text-[10px] font-semibold tracking-widest uppercase text-gray-500">Order ID</th>
                    <th className="p-4 text-[10px] font-semibold tracking-widest uppercase text-gray-500">Customer</th>
                    <th className="p-4 text-[10px] font-semibold tracking-widest uppercase text-gray-500">Date</th>
                    <th className="p-4 text-[10px] font-semibold tracking-widest uppercase text-gray-500">Total</th>
                    <th className="p-4 text-[10px] font-semibold tracking-widest uppercase text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-[#E5E5E5] last:border-0 hover:bg-[#F9F9F9] transition-colors">
                      <td className="p-4 text-sm font-semibold tracking-widest">{order.id}</td>
                      <td className="p-4">
                        <p className="text-sm font-semibold uppercase">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.email}</p>
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
    </div>
  )
}
