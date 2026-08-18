import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "../context/CartContext"
import { useData } from "../context/DataContext"
import { Link } from "react-router"
import { CreditCard, Truck, Building2, Home, ChevronLeft } from "lucide-react"
import { WILAYAS, getCommunesByWilaya, getShippingPrice, DeliveryType } from "../data/shipping"

export default function Checkout() {
  const { items, cartCount, clearCart } = useCart()
  const { addOrder } = useData()
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">("cod")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    wilayaCode: "",
    commune: "",
    deliveryType: "stopdesk" as DeliveryType,
    address: "",
    firstName: "",
    lastName: "",
    postalCode: "",
    email: ""
  })

  const communes = useMemo(
    () => getCommunesByWilaya(formData.wilayaCode),
    [formData.wilayaCode]
  )

  const isStripe = paymentMethod === "stripe"

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const shipping = isStripe
    ? 0
    : formData.wilayaCode
    ? getShippingPrice(formData.wilayaCode, formData.deliveryType)
    : 0
  const total = subtotal + shipping

  const handleWilayaChange = (code: string) => {
    setFormData({ ...formData, wilayaCode: code, commune: "" })
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    const wilaya = WILAYAS.find(w => w.code === formData.wilayaCode)
    // Mock processing delay
    setTimeout(() => {
      addOrder(
        isStripe
          ? {
              customerName: `${formData.firstName} ${formData.lastName}`.trim(),
              phone: formData.phone,
              email: formData.email,
              wilaya: "",
              commune: "",
              deliveryType: "domicile",
              address: `${formData.address}${formData.postalCode ? ", " + formData.postalCode : ""}`,
              items: items,
              total: total
            }
          : {
              customerName: formData.fullName,
              phone: formData.phone,
              wilaya: wilaya?.name ?? "",
              commune: formData.commune,
              deliveryType: formData.deliveryType,
              address: formData.deliveryType === "domicile" ? formData.address : "",
              items: items,
              total: total
            }
      )
      clearCart()
      setIsProcessing(false)
      setIsSuccess(true)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#F9F9F9] pt-32 pb-12 text-black flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 max-w-lg w-full text-center border border-[#E5E5E5] shadow-sm"
        >
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-display tracking-widest uppercase mb-4">
            Order Confirmed
          </h1>
          <p className="text-sm font-sans tracking-wide text-gray-500 mb-8">
            Thank you for your purchase. Your order number is #YQ-{Math.floor(Math.random() * 100000)}.
            We'll email you an order confirmation with details and tracking info.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-4 bg-black text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F9F9F9] pt-24 pb-12 text-black">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 xl:col-span-8">
          <Link
            to="/shop"
            className="inline-flex items-center text-xs font-semibold tracking-widest uppercase text-gray-500 hover:text-black transition-colors mb-8"
          >
            <ChevronLeft size={16} className="mr-2" /> Back to Shop
          </Link>

          <form onSubmit={handleCheckout} className="space-y-10">
            {/* Customer Info */}
            <section>
              <h2 className="text-lg font-display tracking-widest uppercase mb-6 border-b border-[#E5E5E5] pb-4">
                1. Customer Information
              </h2>

              {isStripe ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full p-4 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full p-4 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      placeholder="Last name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                      Phone Number (with country code)
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-4 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      placeholder="+213 X XX XX XX XX"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-4 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      placeholder="Email for order confirmation"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full p-4 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      placeholder="Full name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-4 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      placeholder="0X XX XX XX XX"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Shipping Info */}
            <section>
              <h2 className="text-lg font-display tracking-widest uppercase mb-6 border-b border-[#E5E5E5] pb-4">
                2. Shipping
              </h2>

              {isStripe ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-4 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      placeholder="Street, building, apt..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full p-4 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      placeholder="Postal code"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {/* Delivery Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label
                      className={`flex items-center gap-3 border p-4 cursor-pointer transition-colors ${
                        formData.deliveryType === "stopdesk"
                          ? "border-black bg-white"
                          : "border-[#E5E5E5] bg-white hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryType"
                        value="stopdesk"
                        checked={formData.deliveryType === "stopdesk"}
                        onChange={() => setFormData({ ...formData, deliveryType: "stopdesk" })}
                        className="h-4 w-4 text-black border-gray-300 focus:ring-black accent-black"
                      />
                      <Building2 size={20} strokeWidth={1.5} className="text-gray-400" />
                      <div>
                        <span className="block text-xs font-semibold tracking-widest uppercase">
                          Yalidine Stop Desk
                        </span>
                        <span className="block text-[10px] text-gray-500 tracking-wide mt-1">
                          Pick up from the local office
                        </span>
                      </div>
                    </label>
                    <label
                      className={`flex items-center gap-3 border p-4 cursor-pointer transition-colors ${
                        formData.deliveryType === "domicile"
                          ? "border-black bg-white"
                          : "border-[#E5E5E5] bg-white hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryType"
                        value="domicile"
                        checked={formData.deliveryType === "domicile"}
                        onChange={() => setFormData({ ...formData, deliveryType: "domicile" })}
                        className="h-4 w-4 text-black border-gray-300 focus:ring-black accent-black"
                      />
                      <Home size={20} strokeWidth={1.5} className="text-gray-400" />
                      <div>
                        <span className="block text-xs font-semibold tracking-widest uppercase">
                          Home Delivery
                        </span>
                        <span className="block text-[10px] text-gray-500 tracking-wide mt-1">
                          Delivered to your door
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                        Wilaya
                      </label>
                      <select
                        required
                        value={formData.wilayaCode}
                        onChange={e => handleWilayaChange(e.target.value)}
                        className="w-full p-4 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      >
                        <option value="" disabled>Select wilaya</option>
                        {WILAYAS.map(w => (
                          <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                        Commune
                      </label>
                      <select
                        required
                        disabled={!formData.wilayaCode}
                        value={formData.commune}
                        onChange={e => setFormData({ ...formData, commune: e.target.value })}
                        className="w-full p-4 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors disabled:bg-[#F2F2F0] disabled:cursor-not-allowed"
                      >
                        <option value="" disabled>
                          {formData.wilayaCode ? "Select commune" : "Select a wilaya first"}
                        </option>
                        {communes.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {formData.deliveryType === "domicile" && (
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                          Home Address
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={e => setFormData({ ...formData, address: e.target.value })}
                          className="w-full p-4 bg-white border border-[#E5E5E5] text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                          placeholder="Street, building, floor..."
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-lg font-display tracking-widest uppercase mb-6 border-b border-[#E5E5E5] pb-4">
                3. Payment Method
              </h2>
              <div className="space-y-4">
                {/* Stripe Option */}
                <label
                  className={`block relative border p-4 cursor-pointer transition-colors ${
                    paymentMethod === "stripe"
                      ? "border-black bg-white"
                      : "border-[#E5E5E5] bg-white hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="stripe"
                        checked={paymentMethod === "stripe"}
                        onChange={() => setPaymentMethod("stripe")}
                        className="h-4 w-4 text-black border-gray-300 focus:ring-black accent-black"
                      />
                      <div className="ml-4">
                        <span className="block text-sm font-semibold tracking-widest uppercase">
                          Credit Card (Stripe)
                        </span>
                        <span className="block text-[10px] text-gray-500 tracking-wide mt-1">
                          Pay securely with your credit card
                        </span>
                      </div>
                    </div>
                    <CreditCard size={24} strokeWidth={1} className="text-gray-400" />
                  </div>

                  {/* Stripe Mock Form */}
                  <AnimatePresence>
                    {paymentMethod === "stripe" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 pt-6 border-t border-[#E5E5E5] grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <input
                              type="text"
                              placeholder="Card Number"
                              className="w-full p-4 bg-[#F9F9F9] border border-[#E5E5E5] text-sm focus:outline-none focus:border-black transition-colors"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="MM / YY"
                              className="w-full p-4 bg-[#F9F9F9] border border-[#E5E5E5] text-sm focus:outline-none focus:border-black transition-colors"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="CVC"
                              className="w-full p-4 bg-[#F9F9F9] border border-[#E5E5E5] text-sm focus:outline-none focus:border-black transition-colors"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </label>

                {/* COD Option */}
                <label
                  className={`block relative border p-4 cursor-pointer transition-colors ${
                    paymentMethod === "cod"
                      ? "border-black bg-white"
                      : "border-[#E5E5E5] bg-white hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="h-4 w-4 text-black border-gray-300 focus:ring-black accent-black"
                      />
                      <div className="ml-4">
                        <span className="block text-sm font-semibold tracking-widest uppercase">
                          Cash on Delivery
                        </span>
                        <span className="block text-[10px] text-gray-500 tracking-wide mt-1">
                          Pay with cash when your order arrives
                        </span>
                      </div>
                    </div>
                    <Truck size={24} strokeWidth={1} className="text-gray-400" />
                  </div>
                </label>
              </div>
            </section>

            <button
              type="submit"
              disabled={isProcessing || cartCount === 0}
              className={`w-full py-5 text-sm font-sans font-semibold tracking-[0.2em] uppercase transition-all duration-300 ${
                isProcessing || cartCount === 0
                  ? "bg-[#E5E5E5] text-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {isProcessing ? "Processing..." : "PLACE ORDER"}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white border border-[#E5E5E5] p-6 sticky top-32">
            <h2 className="text-lg font-display tracking-widest uppercase mb-6 border-b border-[#E5E5E5] pb-4">
              Order Summary
            </h2>

            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 mb-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover bg-[#F2F2F0]"
                    />
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-xs font-semibold uppercase tracking-widest leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-sans tracking-widest mt-1">
                      SIZE: {item.size}
                    </p>
                  </div>
                  <p className="text-xs font-semibold tracking-widest self-center text-black">
                    {(item.price * item.quantity).toLocaleString()} DZD
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E5E5E5] pt-6 space-y-4">
              <div className="flex justify-between items-center text-xs font-semibold tracking-widest uppercase text-gray-500">
                <span>Subtotal</span>
                <span className="text-black">{subtotal.toLocaleString()} DZD</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold tracking-widest uppercase text-gray-500">
                <span>Shipping</span>
                <span className="text-black">
                  {isStripe ? "Calculated at payment" : `${shipping.toLocaleString()} DZD`}
                </span>
              </div>
              <div className="border-t border-[#E5E5E5] pt-4 mt-4 flex justify-between items-center">
                <span className="text-sm font-semibold tracking-widest uppercase text-black">Total</span>
                <span className="text-lg font-semibold tracking-widest text-black">
                  {total.toLocaleString()} <span className="text-[10px] text-gray-500">DZD</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}