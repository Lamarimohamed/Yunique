import { createContext, useContext, useState, useEffect, ReactNode } from "react"
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
  addProduct: (product: Omit<Product, "id">) => Promise<void>
  updateProduct: (id: string, product: Omit<Product, "id">) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  addOrder: (order: Omit<Order, "id" | "date" | "status">) => Promise<void>
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>
  deleteOrder: (id: string) => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Fetch data from Supabase on mount
  useEffect(() => {
    async function fetchData() {
      // 1. Fetch Products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (productsData && !productsError) {
        // Map database fields (snake_case) to frontend fields (camelCase)
        const mappedProducts: Product[] = productsData.map(p => ({
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
        setProducts(mappedProducts)
      } else if (productsError) {
        console.error("Error fetching products:", productsError)
      }

      // 2. Fetch Orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('date', { ascending: false })

      if (ordersData && !ordersError) {
        const mappedOrders: Order[] = ordersData.map(o => ({
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
        setOrders(mappedOrders)
      } else if (ordersError) {
        console.error("Error fetching orders:", ordersError)
      }

      setIsLoaded(true)
    }

    fetchData()
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
      .select()
      .single()
      
    if (data && !error) {
      const newProduct: Product = { ...product, id: data.id }
      // Update UI
      setProducts(prev => [newProduct, ...prev])
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
    }
  }

  return (
    <DataContext.Provider value={{ products, orders, addProduct, updateProduct, deleteProduct, addOrder, updateOrderStatus, deleteOrder }}>
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