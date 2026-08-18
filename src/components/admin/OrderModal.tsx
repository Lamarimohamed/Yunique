import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Order } from "../../context/DataContext"
import { WILAYAS, getShippingPrice } from "../../data/shipping"

type OrderModalProps = {
  isOpen: boolean
  onClose: () => void
  order: Order | null
}

export default function OrderModal({ isOpen, onClose, order }: OrderModalProps) {
  if (!isOpen || !order) return null

  const wilayaCode = WILAYAS.find(w => w.name === order.wilaya)?.code ?? ""
  const shipping = wilayaCode ? getShippingPrice(wilayaCode, order.deliveryType) : 0
  const subtotal = order.total - shipping

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#E5E5E5] relative shadow-2xl"
        >
          <div className="sticky top-0 bg-white border-b border-[#E5E5E5] p-6 flex justify-between items-center z-10">
            <div>
              <h2 className="text-xl font-display tracking-widest uppercase">
                Order {order.id}
              </h2>
              <p className="text-xs text-gray-500 font-sans tracking-widest mt-1">
                {new Date(order.date).toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black transition-colors bg-[#F9F9F9] p-2 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Details */}
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4 border-b border-[#E5E5E5] pb-2">
                Customer Details
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400">Name</p>
                  <p className="font-semibold uppercase">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400">Phone</p>
                  <p>{order.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400">Delivery</p>
                  <p className="uppercase">
                    {order.deliveryType === "domicile" ? "Home Delivery" : "Yalidine Stop Desk"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400">Wilaya / Commune</p>
                  <p className="uppercase">{order.wilaya} - {order.commune}</p>
                </div>
                {order.deliveryType === "domicile" && (
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-gray-400">Home Address</p>
                    <p className="uppercase">{order.address}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400">Status</p>
                  <span className={`inline-block mt-1 text-[10px] font-semibold tracking-widest uppercase px-2 py-1 ${
                    order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                    order.status === "Shipped" ? "bg-blue-100 text-blue-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4 border-b border-[#E5E5E5] pb-2">
                Order Items
              </h3>
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover bg-[#F2F2F0]"
                    />
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-xs font-semibold uppercase tracking-widest leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-sans tracking-widest mt-1">
                        SIZE: {item.size} | QTY: {item.quantity}
                      </p>
                      <p className="text-xs font-semibold tracking-widest mt-2">
                        {(item.price * item.quantity).toLocaleString()} DZD
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E5E5E5] mt-6 pt-4 space-y-2">
                <div className="flex justify-between text-xs font-semibold tracking-widest uppercase text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-black">{subtotal.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-xs font-semibold tracking-widest uppercase text-gray-500">
                  <span>Shipping</span>
                  <span className="text-black">{shipping.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-sm font-semibold tracking-widest uppercase mt-4 pt-4 border-t border-[#E5E5E5]">
                  <span>Total</span>
                  <span>{order.total.toLocaleString()} DZD</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}