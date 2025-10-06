"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Plus, Calendar } from "lucide-react"
import { storage } from "@/lib/storage"
import type { FoodItem } from "@/lib/types"
import { getFoodIcon } from "@/lib/food-icons"

export default function InventoryPage() {
  const [items, setItems] = useState<FoodItem[]>([])
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = () => {
    const loadedItems = storage.getFoodItems()
    setItems(loadedItems)
  }

  const handleDelete = (id: string) => {
    if (confirm("この食材を削除しますか？")) {
      storage.deleteFoodItem(id)
      loadItems()
    }
  }

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingItem) return

    const formData = new FormData(e.currentTarget)
    const updates: Partial<FoodItem> = {
      name: formData.get("name") as string,
      quantity: Number(formData.get("quantity")),
      unit: formData.get("unit") as string,
      expiryDate: formData.get("expiryDate") as string,
      category: formData.get("category") as string,
    }

    storage.updateFoodItem(editingItem.id, updates)
    loadItems()
    setIsEditDialogOpen(false)
    setEditingItem(null)
  }

  const handleAddNew = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const newItem: FoodItem = {
      id: crypto.randomUUID(),
      name: formData.get("name") as string,
      quantity: Number(formData.get("quantity")),
      unit: formData.get("unit") as string,
      expiryDate: formData.get("expiryDate") as string,
      detectedAt: new Date().toISOString(),
      category: formData.get("category") as string,
    }

    storage.addFoodItem(newItem)
    loadItems()
    setIsAddDialogOpen(false)
  }

  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return "none"

    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "expired"
    if (diffDays <= 3) return "warning"
    return "good"
  }

  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, FoodItem[]>,
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-2">食材在庫管理</h2>
            <p className="text-lg text-muted-foreground">現在の在庫: {items.length}個</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-5 h-5 mr-2" />
                食材を追加
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新しい食材を追加</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddNew} className="space-y-4">
                <div>
                  <Label htmlFor="add-name">食材名</Label>
                  <Input id="add-name" name="name" required placeholder="例: トマト" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="add-quantity">数量</Label>
                    <Input id="add-quantity" name="quantity" type="number" required defaultValue={1} min={0} />
                  </div>
                  <div>
                    <Label htmlFor="add-unit">単位</Label>
                    <Select name="unit" defaultValue="個">
                      <SelectTrigger id="add-unit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="個">個</SelectItem>
                        <SelectItem value="本">本</SelectItem>
                        <SelectItem value="袋">袋</SelectItem>
                        <SelectItem value="パック">パック</SelectItem>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="add-category">カテゴリー</Label>
                  <Select name="category" defaultValue="その他">
                    <SelectTrigger id="add-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="野菜">野菜</SelectItem>
                      <SelectItem value="果物">果物</SelectItem>
                      <SelectItem value="タンパク質">タンパク質</SelectItem>
                      <SelectItem value="乳製品">乳製品</SelectItem>
                      <SelectItem value="その他">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="add-expiry">賞味期限（任意）</Label>
                  <Input id="add-expiry" name="expiryDate" type="date" />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    追加
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {items.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <Plus className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-semibold text-foreground mb-2">在庫がありません</p>
                <p className="text-muted-foreground">画像をアップロードするか、手動で食材を追加してください</p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category}>
                <h3 className="text-2xl font-bold text-foreground mb-4">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryItems.map((item) => {
                    const expiryStatus = getExpiryStatus(item.expiryDate)
                    const icon = getFoodIcon(item.name)

                    return (
                      <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-4xl">{icon}</div>
                            <div>
                              <h4 className="text-lg font-semibold text-foreground">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.quantity} {item.unit}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(item)}
                              className="hover:bg-muted"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(item.id)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {item.expiryDate && (
                          <div
                            className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
                              expiryStatus === "expired"
                                ? "bg-destructive/10 text-destructive"
                                : expiryStatus === "warning"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Calendar className="w-4 h-4" />
                            <span>
                              {expiryStatus === "expired"
                                ? "期限切れ"
                                : `期限: ${new Date(item.expiryDate).toLocaleDateString("ja-JP")}`}
                            </span>
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>食材を編集</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">食材名</Label>
                  <Input id="edit-name" name="name" required defaultValue={editingItem.name} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-quantity">数量</Label>
                    <Input
                      id="edit-quantity"
                      name="quantity"
                      type="number"
                      required
                      defaultValue={editingItem.quantity}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-unit">単位</Label>
                    <Select name="unit" defaultValue={editingItem.unit}>
                      <SelectTrigger id="edit-unit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="個">個</SelectItem>
                        <SelectItem value="本">本</SelectItem>
                        <SelectItem value="袋">袋</SelectItem>
                        <SelectItem value="パック">パック</SelectItem>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-category">カテゴリー</Label>
                  <Select name="category" defaultValue={editingItem.category}>
                    <SelectTrigger id="edit-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="野菜">野菜</SelectItem>
                      <SelectItem value="果物">果物</SelectItem>
                      <SelectItem value="タンパク質">タンパク質</SelectItem>
                      <SelectItem value="乳製品">乳製品</SelectItem>
                      <SelectItem value="その他">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-expiry">賞味期限（任意）</Label>
                  <Input id="edit-expiry" name="expiryDate" type="date" defaultValue={editingItem.expiryDate || ""} />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    保存
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
