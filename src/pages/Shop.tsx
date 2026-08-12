import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router"

export default function Shop() {
  const [filter, setFilter] = useState("ALL")

  const filters = [
    "ALL",
    "TEES",
    "HOODIES",
    "PANTS",
    "OUTERWEAR",
    "ACCESSORIES",
  ]

  const products = [
    {
      id: "01",
      name: "YUNIQUE OVERSIZED TEE",
      color: "BLACK",
      price: "12,000 DZD",
      img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1287&auto=format&fit=crop",
      cat: "TEES",
    },
    {
      id: "02",
      name: "RAW FORM HOODIE",
      color: "OFF BLACK",
      price: "18,500 DZD",
      img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1287&auto=format&fit=crop",
      cat: "HOODIES",
    },
    {
      id: "03",
      name: "IDENTITY CARGO PANT",
      color: "DARK GRAY",
      price: "24,000 DZD",
      img: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=1480&auto=format&fit=crop",
      cat: "PANTS",
    },
    {
      id: "04",
      name: "SIGNATURE CAP",
      color: "BLACK",
      price: "5,500 DZD",
      img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1336&auto=format&fit=crop",
      cat: "ACCESSORIES",
    },
    {
      id: "05",
      name: "STRUCTURE JACKET",
      color: "BLACK",
      price: "32,000 DZD",
      img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1287&auto=format&fit=crop",
      cat: "OUTERWEAR",
    },
    {
      id: "06",
      name: "CORE TEE",
      color: "WHITE",
      price: "10,500 DZD",
      img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480&auto=format&fit=crop",
      cat: "TEES",
    },
  ]

  const filteredProducts =
    filter === "ALL" ? products : products.filter((p) => p.cat === filter)

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 px-6 text-black">
      <div className="max-w-[1440px] mx-auto">
        <header className="mb-16 border-b border-[#E5E5E5] pb-8">
          <h1 className="text-5xl md:text-7xl font-display tracking-tighter uppercase mb-12">
            SHOP
          </h1>

          <div
            className="flex flex-wrap gap-8 font-sans text-xs tracking-[0.1em] uppercase text-gray-400 font-semibold"
            role="tablist"
          >
            {filters.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black p-1 ${
                  filter === f ? "text-black border-b-2 border-black" : ""
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
          layout
        >
          {filteredProducts.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group cursor-none"
              data-cursor="view"
            >
              <Link
                to={`/product/${p.id}`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-[#F2F2F0]">
                  <img
                    src={p.img}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    alt={`Image of ${p.name}`}
                    loading="lazy"
                  />
                </div>
                <div className="flex justify-between items-start font-sans text-xs tracking-widest uppercase text-black">
                  <div>
                    <h2 className="font-semibold mb-1">{p.name}</h2>
                    <p className="text-gray-500">{p.color}</p>
                  </div>
                  <p className="font-semibold">{p.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
