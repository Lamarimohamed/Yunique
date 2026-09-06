import { useState } from "react"
import { motion } from "framer-motion"
import { useCart } from "../context/CartContext"
import { useData } from "../context/DataContext"
import { useParams, Link } from "react-router"

export default function ProductDetail() {
  const { id } = useParams()
  const { products } = useData()
  const product = products.find(p => p.id === id) || products[0] // Fallback for safety

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const { addToCart, openCart } = useCart()

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-24 text-black">
        <div className="text-center">
          <h1 className="text-2xl font-display tracking-widest uppercase mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-xs font-semibold tracking-widest uppercase hover:text-gray-500">Return to Shop</Link>
        </div>
      </main>
    )
  }

  const sizes = product.sizes
  const images = product.images?.length ? product.images : [product.image]

  const handleAdd = () => {
    if (!selectedSize || (product.colors?.length > 0 && !selectedColor)) return
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor || undefined,
      quantity: 1,
      image: product.image
    })
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main className="min-h-screen bg-white pt-24 pb-12 text-black">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-6rem)]">
        {/* Left: Gallery */}
        <div className="w-full lg:w-2/3 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={`${product.name} ${index + 1}`}
              className="w-full h-[80vh] object-cover bg-[#F2F2F0]"
              data-cursor="explore"
            />
          ))}
        </div>

        {/* Right: Sticky Info */}
        <div className="w-full lg:w-1/3 p-6 lg:pl-12 lg:sticky lg:top-24 h-fit">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <h1 className="text-3xl md:text-4xl font-display tracking-tighter uppercase mb-2 text-black">
              {product.name}
            </h1>
            <p className="text-xl text-black font-sans tracking-widest mb-12 font-semibold">
              {product.price.toLocaleString()} DZD
            </p>

            {product.colors?.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-sans tracking-[0.1em] text-gray-500 uppercase font-semibold mb-4">
                COLOR
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    aria-pressed={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-3 text-xs uppercase tracking-widest border ${
                      selectedColor === color ? "bg-black text-white border-black" : "border-[#E5E5E5] hover:border-black"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            )}

            <div className="mb-12">
              <div className="flex justify-between items-end mb-4">
                <p className="text-xs font-sans tracking-[0.1em] text-gray-500 uppercase font-semibold">
                  SIZE
                </p>
                <button
                  aria-label="Open Size Guide"
                  className="text-[10px] tracking-widest text-gray-400 hover:text-black transition-colors underline underline-offset-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
                >
                  SIZE GUIDE
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    aria-label={`Select size ${s}`}
                    aria-pressed={selectedSize === s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-3 text-xs font-sans tracking-widest font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                      selectedSize === s
                        ? "bg-black text-white"
                        : "bg-[#F9F9F9] border border-[#E5E5E5] text-black hover:border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={!selectedSize || (product.colors?.length > 0 && !selectedColor)}
              aria-label={added ? "Added to bag" : "Add to bag"}
              className={`w-full py-5 text-sm font-sans font-semibold tracking-[0.2em] uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                !selectedSize || (product.colors?.length > 0 && !selectedColor)
                  ? "bg-[#E5E5E5] text-gray-400 cursor-not-allowed"
                  : added
                    ? "bg-green-600 text-white"
                    : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {added ? "ADDED ✓" : "ADD TO BAG"}
            </button>

            <div className="mt-12 space-y-6 text-xs font-sans tracking-wide text-gray-600 leading-relaxed border-t border-[#E5E5E5] pt-8">
              <div>
                <p className="text-black font-semibold uppercase tracking-widest mb-2">
                  DESCRIPTION
                </p>
                <DescriptionContent description={product.description} />
              </div>
              <div>
                <p className="text-black font-semibold uppercase tracking-widest mb-2">
                  SHIPPING
                </p>
                <p className="normal-case">
                  Express shipping worldwide. Duties and taxes calculated at
                  checkout. Local delivery within 24-48 hours.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

function DescriptionContent({ description }: { description: string }) {
  const parts = description.split(/(<img data-description-image="[^"]+" alt="[^"]*" \/>)/g)
  return (
    <div className="normal-case space-y-3">
      {parts.map((part, index) => {
        const match = part.match(/^<img data-description-image="([^"]+)" alt="([^"]*)" \/>$/)
        if (match) {
          return <img key={index} src={match[1]} alt={match[2]} className="max-w-full h-auto" />
        }
        return part ? <span key={index} className="block whitespace-pre-wrap">{part}</span> : null
      })}
    </div>
  )
}
