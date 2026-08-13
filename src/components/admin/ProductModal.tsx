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
    collection: "",
    isDraft: false
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
        collection: product.collection || "",
        isDraft: product.isDraft || false
      })
    } else {
      setFormData({
        name: "",
        price: "",
        image: "",
        description: "",
        sizes: "S, M, L",
        isNew: false,
        collection: "",
        isDraft: false
      })
    }
  }, [product, isOpen])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name: formData.name,
      price: parseInt(formData.price) || 0,
      image: formData.image,
      description: formData.description,
      sizes: formData.sizes.split(",").map(s => s.trim()).filter(Boolean),
      isNew: formData.isNew,
      collection: formData.collection,
      isDraft: formData.isDraft
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
                Image (Upload or URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="flex-1 p-3 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black"
                />
                <label className="bg-[#F9F9F9] border border-[#E5E5E5] px-4 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors text-xs font-semibold tracking-widest uppercase">
                  Upload
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              {formData.image && (
                <div className="mt-3 w-20 h-24 border border-[#E5E5E5] relative">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
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
            <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-[#E5E5E5]">
              <button
                type="submit"
                onClick={() => setFormData(prev => ({ ...prev, isDraft: false }))}
                className="w-full py-4 bg-black text-white text-sm font-sans font-semibold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
              >
                {product && !product.isDraft ? "Save Changes" : "Publish Product"}
              </button>
              <div className="flex gap-3">
                <button
                  type="submit"
                  onClick={() => setFormData(prev => ({ ...prev, isDraft: true }))}
                  className="flex-1 py-3 bg-white border border-[#E5E5E5] text-black text-xs font-sans font-semibold tracking-[0.2em] uppercase hover:border-black transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-[#F9F9F9] border border-[#E5E5E5] text-red-600 text-xs font-sans font-semibold tracking-[0.2em] uppercase hover:border-red-600 transition-colors"
                >
                  Discard
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
