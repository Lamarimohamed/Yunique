import { useState } from "react"
import { motion } from "framer-motion"
import { useCart } from "../context/CartContext"

export default function ProductDetail() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const { addToCart, openCart } = useCart()

  const sizes = ["XS", "S", "M", "L", "XL"]

  const handleAdd = () => {
    if (!selectedSize) return
    addToCart({
      id: "1", // Hardcoded for now since there's no dynamic fetching
      name: "YUNIQUE OVERSIZED TEE",
      price: 12000,
      size: selectedSize,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1287&auto=format&fit=crop"
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
          <img
            src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1287&auto=format&fit=crop"
            alt="YUNIQUE OVERSIZED TEE Front"
            className="w-full h-[80vh] object-cover bg-[#F2F2F0]"
            data-cursor="explore"
          />
          <img
            src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1287&auto=format&fit=crop"
            alt="YUNIQUE OVERSIZED TEE Back"
            className="w-full h-[80vh] object-cover bg-[#F2F2F0]"
            data-cursor="explore"
          />
        </div>

        {/* Right: Sticky Info */}
        <div className="w-full lg:w-1/3 p-6 lg:pl-12 lg:sticky lg:top-24 h-fit">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <h1 className="text-3xl md:text-4xl font-display tracking-tighter uppercase mb-2 text-black">
              YUNIQUE OVERSIZED TEE
            </h1>
            <p className="text-xl text-black font-sans tracking-widest mb-12 font-semibold">
              12,000 DZD
            </p>

            <div className="mb-8">
              <p className="text-xs font-sans tracking-[0.1em] text-gray-500 uppercase font-semibold mb-4">
                COLOR: BLACK
              </p>
            </div>

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
              disabled={!selectedSize}
              aria-label={added ? "Added to bag" : "Add to bag"}
              className={`w-full py-5 text-sm font-sans font-semibold tracking-[0.2em] uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                !selectedSize
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
                <p className="normal-case">
                  Heavyweight cotton jersey. Oversized boxy fit. Dropped
                  shoulders. Signature fingerprint subtle hit on the back neck.
                  Manufactured in Portugal.
                </p>
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
