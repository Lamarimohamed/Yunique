import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router"
import { useData } from "../context/DataContext"

export default function Shop() {
  const [filter, setFilter] = useState("ALL")
  const { products } = useData()

  const filters = [
    "ALL",
    "TEES",
    "HOODIES",
    "PANTS",
    "OUTERWEAR",
    "ACCESSORIES",
  ]

  const filteredProducts =
    filter === "ALL" ? products : products // We removed cat from product for simplicity, so always show all or implement cat later

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
                    src={p.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    alt={`Image of ${p.name}`}
                    loading="lazy"
                  />
                </div>
                <div className="flex justify-between items-start font-sans text-xs tracking-widest uppercase text-black">
                  <div>
                    <h2 className="font-semibold mb-1">{p.name}</h2>
                    <p className="text-gray-500">{"BLACK"}</p>
                  </div>
                  <p className="font-semibold">{p.price.toLocaleString()} DZD</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
