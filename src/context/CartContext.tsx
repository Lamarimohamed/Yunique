import { createContext, useContext, useState, ReactNode } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  size: string
  color?: string
  quantity: number
  image: string
}

type CartContextType = {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string, size: string, color?: string) => void
  cartCount: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)
  const clearCart = () => setItems([])

  const addToCart = (item: CartItem) => {
    setItems((current) => {
      const existing = current.find(
        (i) => i.id === item.id && i.size === item.size && i.color === item.color
      )
      if (existing) {
        return current.map((i) =>
          i.id === item.id && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...current, item]
    })
  }

  const removeFromCart = (id: string, size: string, color?: string) => {
    setItems((current) =>
      current.filter((i) => !(i.id === id && i.size === size && i.color === color))
    )
  }

  const cartCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, cartCount, isCartOpen, openCart, closeCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
