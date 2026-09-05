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
    images: [] as string[],
    colors: [] as string[],
    colorInput: "",
    description: "",
    sizes: ["S", "M", "L"],
    isNew: false,
    collection: "",
    isDraft: false
  })

  const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"]

  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        image: product.image,
        images: product.images?.length ? product.images : [product.image],
        colors: product.colors || [],
        colorInput: "",
        description: product.description,
        sizes: product.sizes,
        isNew: product.isNew || false,
        collection: product.collection || "",
        isDraft: product.isDraft || false
      })
    } else {
      setFormData({
        name: "",
        price: "",
        image: "",
        images: [],
        colors: [],
        colorInput: "",
        description: "",
        sizes: ["S", "M", "L"],
        isNew: false,
        collection: "",
        isDraft: false
      })
    }
  }, [product, isOpen])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    Promise.all(files.map(file => new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    }))).then(uploadedImages => {
      setFormData(prev => ({
        ...prev,
        image: prev.image || uploadedImages[0],
        images: [...prev.images, ...uploadedImages],
      }))
    })
  }

  const addColor = () => {
    const color = formData.colorInput.trim()
    if (!color || formData.colors.includes(color)) return
    setFormData(prev => ({ ...prev, colors: [...prev.colors, color], colorInput: "" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name: formData.name,
      price: parseInt(formData.price) || 0,
      image: formData.image,
      images: formData.images.length ? formData.images : formData.image ? [formData.image] : [],
      colors: formData.colors,
      description: formData.description,
      sizes: formData.sizes,
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
          className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 border border-[#E5E5E5] relative shadow-2xl text-black"
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                  Product Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-[#F9F9F9] border border-[#E5E5E5] text-sm focus:outline-none focus:border-black transition-colors"
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
                  className="w-full p-3 bg-[#F9F9F9] border border-[#E5E5E5] text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                Images (Upload or URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value, images: e.target.value ? [e.target.value, ...formData.images.slice(1)] : formData.images.slice(1) })}
                  placeholder="https://..."
                  className="flex-1 p-3 bg-[#F9F9F9] border border-[#E5E5E5] text-sm focus:outline-none focus:border-black transition-colors"
                />
                <label className="bg-black text-white px-6 flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors text-xs font-semibold tracking-widest uppercase">
                  Upload
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.images.map((image, index) => (
                    <div key={`${image}-${index}`} className="w-20 h-24 border border-[#E5E5E5] relative">
                      <img src={image} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                Colors
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.colorInput}
                  onChange={e => setFormData({ ...formData, colorInput: e.target.value })}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addColor()
                    }
                  }}
                  placeholder="e.g. Black"
                  className="flex-1 p-3 bg-[#F9F9F9] border border-[#E5E5E5] text-sm focus:outline-none focus:border-black transition-colors"
                />
                <button type="button" onClick={addColor} className="px-4 bg-black text-white text-xs font-semibold tracking-widest uppercase">
                  Add
                </button>
              </div>
              {formData.colors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, colors: prev.colors.filter(item => item !== color) }))}
                      className="px-3 py-1 bg-black text-white text-xs uppercase tracking-wider"
                      aria-label={`Remove ${color} color`}
                    >
                      {color} ×
                    </button>
                  ))}
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
                className="w-full p-3 bg-[#F9F9F9] border border-[#E5E5E5] text-sm focus:outline-none focus:border-black min-h-[80px] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                  Sizes Available
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SIZES.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`min-w-[40px] px-2 py-2 text-xs font-semibold tracking-widest transition-colors border ${
                        formData.sizes.includes(size)
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-500 border-[#E5E5E5] hover:border-black hover:text-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                  Collection Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.collection}
                  onChange={e => setFormData({ ...formData, collection: e.target.value })}
                  className="w-full p-3 bg-[#F9F9F9] border border-[#E5E5E5] text-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="e.g. Summer 2026"
                />
              </div>
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