import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Product } from "../../context/DataContext"

type ProductModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (product: Omit<Product, "id">) => void
  product?: Product | null
}

export default function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    sizes: "S, M, L",
    isNew: false,
    collection: ""
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        image: product.image,
        description: product.description,
        sizes: product.sizes.join(", "),
        isNew: product.isNew || false,
        collection: product.collection || ""
      })
    } else {
      setFormData({
        name: "",
        price: "",
        image: "",
        description: "",
        sizes: "S, M, L",
        isNew: false,
        collection: ""
      })
    }
  }, [product, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name: formData.name,
      price: parseInt(formData.price) || 0,
      image: formData.image,
      description: formData.description,
      sizes: formData.sizes.split(",").map(s => s.trim()).filter(Boolean),
      isNew: formData.isNew,
      collection: formData.collection
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white w-full max-w-lg p-6 border border-[#E5E5E5] relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-xl font-display tracking-widest uppercase mb-6">
            {product ? "Edit Product" : "Add Product"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                Product Name
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                Price (DZD)
              </label>
              <input
                required
                type="number"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-3 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                Image URL
              </label>
              <input
                required
                type="url"
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                className="w-full p-3 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black min-h-[100px]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                Sizes (comma separated)
              </label>
              <input
                required
                type="text"
                value={formData.sizes}
                onChange={e => setFormData({ ...formData, sizes: e.target.value })}
                className="w-full p-3 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                Collection Name (Optional)
              </label>
              <input
                type="text"
                value={formData.collection}
                onChange={e => setFormData({ ...formData, collection: e.target.value })}
                className="w-full p-3 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black"
                placeholder="e.g. Summer 2026"
              />
            </div>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                id="isNew"
                checked={formData.isNew}
                onChange={e => setFormData({ ...formData, isNew: e.target.checked })}
                className="w-4 h-4 text-black border-gray-300 focus:ring-black accent-black"
              />
              <label htmlFor="isNew" className="text-xs font-semibold tracking-widest uppercase text-gray-700 cursor-pointer">
                Mark as "New Drop"
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-black text-white text-sm font-sans font-semibold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors mt-6"
            >
              {product ? "Save Changes" : "Create Product"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
