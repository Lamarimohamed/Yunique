import wilayasData from "./algeria-wilayas.json"

export type DeliveryZone = "alger" | "nord" | "sud"
export type DeliveryType = "stopdesk" | "domicile"

export type Wilaya = {
  code: string
  name: string
  nameAr: string
  zone: DeliveryZone
  communes: string[]
}

export const WILAYAS = wilayasData as Wilaya[]

// Flat shipping rates (DZD) per zone. Edit these to update pricing everywhere at once.
export const SHIPPING_RATES: Record<DeliveryZone, Record<DeliveryType, number>> = {
  alger: { stopdesk: 500, domicile: 500 },
  nord: { stopdesk: 600, domicile: 850 },
  sud: { stopdesk: 1000, domicile: 1200 }
}

export function getWilayaByCode(code: string): Wilaya | undefined {
  return WILAYAS.find(w => w.code === code)
}

export function getCommunesByWilaya(code: string): string[] {
  return getWilayaByCode(code)?.communes ?? []
}

export function getShippingPrice(wilayaCode: string, deliveryType: DeliveryType): number {
  const wilaya = getWilayaByCode(wilayaCode)
  if (!wilaya) return 0
  return SHIPPING_RATES[wilaya.zone][deliveryType]
}
