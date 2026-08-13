import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type Product = {
  id: string
  name: string
  price: number
  image: string
  description: string
  sizes: string[]
  isNew?: boolean
  collection?: string
  isDraft?: boolean
}

export type Order = {
  id: string
  customerName: string
  email: string
  phone: string
  address: string
  items: any[]
  total: number
  status: "Pending" | "Shipped" | "Delivered"
  date: string
}

type DataContextType = {
  products: Product[]
  orders: Order[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, product: Omit<Product, "id">) => void
  deleteProduct: (id: string) => void
  addOrder: (order: Omit<Order, "id" | "date" | "status">) => void
  updateOrderStatus: (id: string, status: Order["status"]) => void
}

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "YUNIQUE OVERSIZED TEE",
    price: 12000,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1287&auto=format&fit=crop",
    description: "Heavyweight cotton jersey. Oversized boxy fit.",
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: true,
    collection: "Core Essentials"
  },
  {
    id: "2",
    name: "YUNIQUE ESSENTIAL HOODIE",
    price: 18500,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1287&auto=format&fit=crop",
    description: "Premium fleece. Relaxed fit for everyday wear.",
    sizes: ["S", "M", "L", "XL"],
    isNew: false,
    collection: "Core Essentials"
  }
]

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("yunique_products")
    const savedOrders = localStorage.getItem("yunique_orders")

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      setProducts(defaultProducts)
      localStorage.setItem("yunique_products", JSON.stringify(defaultProducts))
    }

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
    
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("yunique_products", JSON.stringify(products))
      localStorage.setItem("yunique_orders", JSON.stringify(orders))
    }
  }, [products, orders, isLoaded])

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = { ...product, id: Date.now().toString() }
    setProducts([...products, newProduct])
  }

  const updateProduct = (id: string, product: Omit<Product, "id">) => {
    setProducts(products.map(p => p.id === id ? { ...product, id } : p))
  }

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const addOrder = (order: Omit<Order, "id" | "date" | "status">) => {
    const newOrder: Order = {
      ...order,
      id: `YQ-${Math.floor(Math.random() * 100000)}`,
      date: new Date().toISOString(),
      status: "Pending"
    }
    setOrders([newOrder, ...orders])
  }

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
  }

  return (
    <DataContext.Provider value={{ products, orders, addProduct, updateProduct, deleteProduct, addOrder, updateOrderStatus }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
