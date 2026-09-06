import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2 } from "lucide-react"
import { useCart } from "../../context/CartContext"
import { Link } from "react-router"

export default function CartDrawer() {
  const { isCartOpen, closeCart, items, removeFromCart, cartCount } = useCart()

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-2xl flex flex-col text-black"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
              <h2 className="text-xl font-display tracking-widest uppercase">
                Shopping Bag ({cartCount})
              </h2>
              <button
                onClick={closeCart}
                className="text-gray-400 hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                aria-label="Close cart"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <p className="text-sm font-sans tracking-widest uppercase mb-4">Your bag is empty</p>
                  <button
                    onClick={closeCart}
                    className="text-xs font-semibold tracking-widest uppercase text-black border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color || ""}`} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-32 object-cover bg-[#F2F2F0]"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-semibold uppercase tracking-widest leading-snug pr-4">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.id, item.size, item.color)}
                              className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} strokeWidth={1.5} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 font-sans tracking-widest mt-1">
                            SIZE: {item.size}
                          </p>
                          {item.color && (
                            <p className="text-xs text-gray-500 font-sans tracking-widest mt-1">
                              COLOR: {item.color}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 font-sans tracking-widest mt-1">
                            QTY: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold tracking-widest">
                          {(item.price * item.quantity).toLocaleString()} DZD
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#E5E5E5] bg-[#F9F9F9]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-semibold uppercase tracking-widest">Subtotal</span>
                  <span className="text-lg font-semibold tracking-widest">
                    {subtotal.toLocaleString()} DZD
                  </span>
                </div>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="w-full py-4 bg-black text-white text-sm font-sans font-semibold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 flex justify-center items-center"
                >
                  Checkout
                </Link>
                <p className="text-center text-[10px] text-gray-500 tracking-widest uppercase mt-4">
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}