import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion"
import { useState } from "react"
import { Link, useLocation } from "react-router"
import { Search, ShoppingBag, User, Menu, X } from "lucide-react"
import { useCart } from "../../context/CartContext"

export default function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { cartCount, openCart } = useCart()

  const isLightMode = location.pathname.includes("/shop") || location.pathname.includes("/product") || location.pathname.includes("/checkout")

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  })

  return (
    <>
      <div
        className="fixed top-0 w-full z-50 bg-[#050505] text-white text-[10px] font-sans uppercase tracking-[0.2em] text-center py-1.5 border-b border-[#181818]"
        role="banner"
      >
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="whitespace-nowrap"
          aria-hidden="true"
        >
          NEW DROP / 01 — NOW LIVE &nbsp;&nbsp;&nbsp;&nbsp; NEW DROP / 01 — NOW
          LIVE &nbsp;&nbsp;&nbsp;&nbsp; NEW DROP / 01 — NOW LIVE
          &nbsp;&nbsp;&nbsp;&nbsp; NEW DROP / 01 — NOW LIVE
        </motion.div>
      </div>

      <motion.nav
        className={`fixed top-6 w-full z-40 transition-colors duration-500 ${
          isLightMode
            ? "bg-white/95 backdrop-blur-md border-b border-[#E5E5E5]"
            : scrolled || mobileMenuOpen
            ? "bg-[#050505]/95 backdrop-blur-md border-b border-[#181818]"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Main Navigation"
      >
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex-1 md:w-1/3 flex items-center">
            <Link
              to="/"
              aria-label="YUNIQUE Home"
              className={`text-2xl font-display tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 ${
                isLightMode
                  ? "text-black focus-visible:ring-black"
                  : "text-white focus-visible:ring-white"
              }`}
            >
              YUNIQUE
            </Link>
          </div>

          <div className={`hidden md:flex w-1/3 justify-center space-x-8 text-xs font-display tracking-[0.1em] ${
            isLightMode
              ? "text-gray-600"
              : "text-gray-400"
          }`}>
            <Link
              to="/shop"
              className={`transition-colors focus-visible:outline-none ${
                isLightMode
                  ? "text-black focus-visible:ring-1 focus-visible:ring-black"
                  : "hover:text-white focus-visible:ring-1 focus-visible:ring-white"
              }`}
            >
              Shop
            </Link>
            <Link
              to="/drop"
              className={`transition-colors focus-visible:outline-none ${
                isLightMode
                  ? "hover:text-black focus-visible:ring-1 focus-visible:ring-black"
                  : "hover:text-white focus-visible:ring-1 focus-visible:ring-white"
              }`}
            >
              New Drop
            </Link>
            <Link
              to="/collections"
              className={`transition-colors focus-visible:outline-none ${
                isLightMode
                  ? "hover:text-black focus-visible:ring-1 focus-visible:ring-black"
                  : "hover:text-white focus-visible:ring-1 focus-visible:ring-white"
              }`}
            >
              Collections
            </Link>
            <Link
              to="/about"
              className={`transition-colors focus-visible:outline-none ${
                isLightMode
                  ? "hover:text-black focus-visible:ring-1 focus-visible:ring-black"
                  : "hover:text-white focus-visible:ring-1 focus-visible:ring-white"
              } ${location.pathname.includes("/about") ? isLightMode ? "text-black" : "text-white" : ""}`}
            >
              About
            </Link>
          </div>

          <div className={`flex-1 md:w-1/3 flex justify-end space-x-4 md:space-x-6 items-center transition-colors ${
            isLightMode ? "text-black" : "text-white"
          }`}>
            <button
              aria-label="Search"
              className={`transition-colors focus-visible:outline-none focus-visible:ring-1 hidden md:block ${
                isLightMode
                  ? "hover:text-gray-600 focus-visible:ring-black"
                  : "hover:text-gray-400 focus-visible:ring-white"
              }`}
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button
              aria-label="User Account"
              className={`transition-colors focus-visible:outline-none focus-visible:ring-1 hidden md:block ${
                isLightMode
                  ? "hover:text-gray-600 focus-visible:ring-black"
                  : "hover:text-gray-400 focus-visible:ring-white"
              }`}
            >
              <User size={18} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Shopping Bag"
              onClick={openCart}
              className={`relative transition-colors focus-visible:outline-none focus-visible:ring-1 ${
                isLightMode
                  ? "hover:text-gray-600 focus-visible:ring-black"
                  : "hover:text-gray-400 focus-visible:ring-white"
              }`}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className={`md:hidden transition-colors focus-visible:outline-none focus-visible:ring-1 ${
                isLightMode
                  ? "hover:text-gray-600 focus-visible:ring-black"
                  : "hover:text-gray-400 focus-visible:ring-white"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {mobileMenuOpen ? (
                <X size={20} strokeWidth={1.5} />
              ) : (
                <Menu size={20} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`md:hidden border-b overflow-hidden ${
                isLightMode
                  ? "bg-white border-[#E5E5E5]"
                  : "bg-[#050505] border-[#181818]"
              }`}
            >
              <div className={`px-6 py-6 flex flex-col space-y-6 text-sm font-display tracking-[0.1em] ${
                isLightMode
                  ? "text-gray-600"
                  : "text-gray-300"
              }`}>
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`transition-colors ${
                    isLightMode
                      ? "text-black"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Shop
                </Link>
                <Link
                  to="/drop"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`transition-colors ${
                    isLightMode
                      ? "hover:text-black"
                      : "hover:text-white"
                  }`}
                >
                  New Drop
                </Link>
                <Link
                  to="/collections"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`transition-colors ${
                    isLightMode
                      ? "hover:text-black"
                      : "hover:text-white"
                  }`}
                >
                  Collections
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`transition-colors ${
                    isLightMode
                      ? "hover:text-black"
                      : "hover:text-white"
                  } ${
                    location.pathname.includes("/about")
                      ? isLightMode
                        ? "text-black"
                        : "text-white"
                      : ""
                  }`}
                >
                  About
                </Link>
                <div className={`pt-4 border-t flex space-x-6 ${
                  isLightMode
                    ? "border-[#E5E5E5]"
                    : "border-[#181818]"
                }`}>
                  <button
                    aria-label="Search"
                    className={`transition-colors flex items-center space-x-2 ${
                      isLightMode
                        ? "hover:text-gray-900"
                        : "hover:text-gray-400"
                    }`}
                  >
                    <Search size={16} strokeWidth={1.5} /> <span>SEARCH</span>
                  </button>
                  <button
                    aria-label="User Account"
                    className={`transition-colors flex items-center space-x-2 ${
                      isLightMode
                        ? "hover:text-gray-900"
                        : "hover:text-gray-400"
                    }`}
                  >
                    <User size={16} strokeWidth={1.5} /> <span>ACCOUNT</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
