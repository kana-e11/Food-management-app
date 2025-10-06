export interface FoodItem {
  id: string
  name: string
  quantity: number
  unit: string
  expiryDate?: string
  detectedAt: string
  category: string
}

export interface Recipe {
  id: string
  title: string
  ingredients: string[]
  instructions: string
  imageUrl?: string
  prepTime?: number
  cookTime?: number
}

export interface HistoryItem {
  id: string
  type: "food" | "recipe"
  name: string
  date: string
  quantity?: number
  category?: string
}
