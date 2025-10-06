import type { FoodItem, HistoryItem } from "./types"

const STORAGE_KEYS = {
  FOOD_ITEMS: "food-inventory-items",
  HISTORY: "food-inventory-history",
}

export const storage = {
  getFoodItems(): FoodItem[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS)
    return data ? JSON.parse(data) : []
  },

  saveFoodItems(items: FoodItem[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(items))
  },

  addFoodItem(item: FoodItem): void {
    const items = this.getFoodItems()
    items.push(item)
    this.saveFoodItems(items)

    // Add to history
    this.addHistory({
      id: crypto.randomUUID(),
      type: "food",
      name: item.name,
      date: item.detectedAt,
      quantity: item.quantity,
      category: item.category,
    })
  },

  updateFoodItem(id: string, updates: Partial<FoodItem>): void {
    const items = this.getFoodItems()
    const index = items.findIndex((item) => item.id === id)
    if (index !== -1) {
      items[index] = { ...items[index], ...updates }
      this.saveFoodItems(items)
    }
  },

  deleteFoodItem(id: string): void {
    const items = this.getFoodItems()
    const filtered = items.filter((item) => item.id !== id)
    this.saveFoodItems(filtered)
  },

  getHistory(): HistoryItem[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY)
    return data ? JSON.parse(data) : []
  },

  addHistory(item: HistoryItem): void {
    if (typeof window === "undefined") return
    const history = this.getHistory()
    history.unshift(item)
    // Keep only last 100 items
    const trimmed = history.slice(0, 100)
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed))
  },
}
