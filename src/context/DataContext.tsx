import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { supabase } from "../lib/supabase"

export type Product = {
  id: string
  name: string
  price: number
  image: string
  images: string[]
  colors: string[]
  description: string
  sizes: string[]
  isNew?: boolean
  collection?: string
  isDraft?: boolean
}

export type Order = {
  id: string
  customerName: string
  phone: string
  wilaya: string
  commune: string
  deliveryType: "stopdesk" | "domicile"
  address: string
  items: any[]
  total: number
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled"
  date: string
}

type DataContextType = {
  products: Product[]
  orders: Order[]
  loadOrders: () => Promise<Order[]>
  addProduct: (product: Omit<Product, "id">) => Promise<void>
  updateProduct: (id: string, product: Omit<Product, "id">) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  addOrder: (order: Omit<Order, "id" | "date" | "status">) => Promise<void>
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>
  deleteOrder: (id: string) => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const PRODUCT_COLUMNS = "id,name,price,image,images,colors,description,sizes,is_new,collection,is_draft"
const ORDER_COLUMNS = "id,customer_name,phone,wilaya,commune,delivery_type,address,items,total,status,date"
const MAX_PRODUCTS = 500
const MAX_ORDERS = 100
let productsCache: Product[] | null = null
let productsRequest: Promise<Product[]> | null = null
let ordersCache: Order[] | null = null

async function fetchProducts(): Promise<Product[]> {
  if (productsCache) return productsCache
  if (!productsRequest) {
    productsRequest = supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(MAX_PRODUCTS)
      .then(({ data, error }) => {
        if (error) throw error
        const mappedProducts: Product[] = (data ?? []).map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image],
          colors: Array.isArray(p.colors) ? p.colors : [],
          description: p.description,
          sizes: p.sizes,
          isNew: p.is_new,
          collection: p.collection,
          isDraft: p.is_draft
        }))
        productsCache = mappedProducts
        return mappedProducts
      })
      .finally(() => {
        productsRequest = null
      })
  }
  return productsRequest
}

async function fetchOrders(): Promise<Order[]> {
  if (ordersCache) return ordersCache
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .order("date", { ascending: false })
    .limit(MAX_ORDERS)

  if (error) throw error
  const mappedOrders: Order[] = (data ?? []).map(o => ({
    id: o.id,
    customerName: o.customer_name,
    phone: o.phone,
    wilaya: o.wilaya,
    commune: o.commune,
    deliveryType: o.delivery_type,
    address: o.address,
    items: o.items,
    total: o.total,
    status: o.status,
    date: o.date
  }))
  ordersCache = mappedOrders
  return mappedOrders
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(error => console.error("Error fetching products:", error))
      .finally(() => setIsLoaded(true))
  }, [])

  const loadOrders = useCallback(async () => {
    const loadedOrders = await fetchOrders()
    setOrders(loadedOrders)
    return loadedOrders
  }, [])

  const addProduct = async (product: Omit<Product, "id">) => {
    const dbProduct = {
      name: product.name,
      price: product.price,
      image: product.image,
      images: product.images,
      colors: product.colors,
      description: product.description,
      sizes: product.sizes,
      is_new: product.isNew,
      collection: product.collection,
      is_draft: product.isDraft
    }
    
    // Insert to Supabase
    const { data, error } = await supabase
      .from('products')
      .insert([dbProduct])
      .select(PRODUCT_COLUMNS)
      .single()
      
    if (data && !error) {
      const newProduct: Product = { ...product, id: data.id }
      // Update UI
      setProducts(prev => [newProduct, ...prev])
      productsCache = null
    } else {
      console.error("Error adding product:", error)
    }
  }

  const updateProduct = async (id: string, product: Omit<Product, "id">) => {
    // Optimistic UI update for instant feedback
    setProducts(products.map(p => p.id === id ? { ...product, id } : p))
    
    const dbProduct = {
      name: product.name,
      price: product.price,
      image: product.image,
      images: product.images,
      colors: product.colors,
      description: product.description,
      sizes: product.sizes,
      is_new: product.isNew,
      collection: product.collection,
      is_draft: product.isDraft
    }

    const { error } = await supabase
      .from('products')
      .update(dbProduct)
      .eq('id', id)
      
    if (error) {
      console.error("Error updating product:", error)
    } else {
      productsCache = null
    }
  }

  const deleteProduct = async (id: string) => {
    // Optimistic UI update
    setProducts(products.filter(p => p.id !== id))
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      
    if (error) {
      console.error("Error deleting product:", error)
    } else {
      productsCache = null
    }
  }

  const addOrder = async (order: Omit<Order, "id" | "date" | "status">) => {
    const orderId = `YQ-${Math.floor(Math.random() * 100000)}`
    const dateStr = new Date().toISOString()
    
    const dbOrder = {
      id: orderId,
      customer_name: order.customerName,
      phone: order.phone,
      wilaya: order.wilaya,
      commune: order.commune,
      delivery_type: order.deliveryType,
      address: order.address,
      items: order.items,
      total: order.total,
      status: 'Pending',
      date: dateStr
    }

    // Optimistic UI update
    const newOrder: Order = {
      ...order,
      id: orderId,
      date: dateStr,
      status: "Pending"
    }
    setOrders(prev => [newOrder, ...prev])

    const { error } = await supabase
      .from('orders')
      .insert([dbOrder])
      
    if (error) {
      console.error("Error adding order:", error)
    } else {
      ordersCache = null
    }
  }

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    // Optimistic UI update
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
    
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      
    if (error) {
      console.error("Error updating order status:", error)
    } else {
      ordersCache = null
    }
  }

  const deleteOrder = async (id: string) => {
    // Optimistic UI update
    setOrders(prev => prev.filter(o => o.id !== id))
    
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)
      
    if (error) {
      console.error("Error deleting order:", error)
    } else {
      ordersCache = null
    }
  }

  return (
    <DataContext.Provider value={{ products, orders, loadOrders, addProduct, updateProduct, deleteProduct, addOrder, updateOrderStatus, deleteOrder }}>
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