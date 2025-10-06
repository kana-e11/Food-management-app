"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, ImageIcon, Loader2, Sparkles } from "lucide-react"
import { storage } from "@/lib/storage"
import type { FoodItem } from "@/lib/types"

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedItems, setDetectedItems] = useState<string[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string)
        setDetectedItems([])
      }
      reader.readAsDataURL(file)
    }
  }

  const simulateDetection = async () => {
    setIsDetecting(true)

    // Simulate AI detection with mock data
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockDetectedItems = ["トマト", "にんじん", "たまねぎ", "卵", "牛乳", "レタス"]

    setDetectedItems(mockDetectedItems)
    setIsDetecting(false)
  }

  const saveToInventory = () => {
    const now = new Date().toISOString()

    detectedItems.forEach((itemName) => {
      const newItem: FoodItem = {
        id: crypto.randomUUID(),
        name: itemName,
        quantity: 1,
        unit: "個",
        detectedAt: now,
        category: getCategoryForItem(itemName),
      }
      storage.addFoodItem(newItem)
    })

    alert(`${detectedItems.length}個の食材を在庫に追加しました`)
    setSelectedImage(null)
    setDetectedItems([])
  }

  const getCategoryForItem = (name: string): string => {
    if (["トマト", "にんじん", "たまねぎ", "レタス", "きゅうり"].some((v) => name.includes(v))) {
      return "野菜"
    }
    if (["りんご", "バナナ", "オレンジ"].some((v) => name.includes(v))) {
      return "果物"
    }
    if (["卵", "肉", "鶏肉", "魚"].some((v) => name.includes(v))) {
      return "タンパク質"
    }
    if (["牛乳", "チーズ", "バター"].some((v) => name.includes(v))) {
      return "乳製品"
    }
    return "その他"
  }

  return (
    <div className="min-h-screen bg-pink-50/30">
      <Navigation />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-pink-400" />
            <h2 className="text-4xl font-bold text-pink-700">冷蔵庫の写真をアップロード</h2>
            <Sparkles className="w-8 h-8 text-cyan-400" />
          </div>
          <p className="text-lg text-muted-foreground">
            冷蔵庫内の写真をアップロードすると、AIが自動的に食材を検出します
          </p>
        </div>

        <Card className="p-8 shadow-xl border-2 border-pink-100">
          {!selectedImage ? (
            <label className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-pink-200 rounded-xl cursor-pointer hover:border-pink-300 hover:bg-pink-50/50 transition-all duration-200">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-pink-200 flex items-center justify-center shadow-sm">
                  <Upload className="w-10 h-10 text-pink-700" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground mb-2">画像をアップロード</p>
                  <p className="text-sm text-muted-foreground">クリックして画像を選択、またはドラッグ&ドロップ</p>
                </div>
              </div>
            </label>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-xl overflow-hidden bg-pink-100/50 p-1">
                <div className="bg-white rounded-lg overflow-hidden">
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="Uploaded refrigerator"
                    className="w-full h-auto max-h-[500px] object-contain"
                  />
                </div>
              </div>

              {detectedItems.length === 0 ? (
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={simulateDetection}
                    disabled={isDetecting}
                    size="lg"
                    className="bg-pink-400 hover:bg-pink-500 text-white shadow-md"
                  >
                    {isDetecting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        食材を検出中...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-5 h-5 mr-2" />
                        食材を検出
                      </>
                    )}
                  </Button>
                  <Button onClick={() => setSelectedImage(null)} variant="outline" size="lg" className="border-2">
                    キャンセル
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      検出された食材 ({detectedItems.length}個)
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {detectedItems.map((item, index) => {
                        const colors = [
                          "bg-pink-100 text-pink-700",
                          "bg-purple-100 text-purple-700",
                          "bg-cyan-100 text-cyan-700",
                          "bg-amber-100 text-amber-700",
                          "bg-teal-100 text-teal-700",
                          "bg-violet-100 text-violet-700",
                        ]
                        return (
                          <div
                            key={index}
                            className={`${colors[index % colors.length]} rounded-lg p-4 text-center shadow-sm border border-white`}
                          >
                            <p className="font-medium">{item}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={saveToInventory}
                      size="lg"
                      className="bg-cyan-400 hover:bg-cyan-500 text-white shadow-md"
                    >
                      在庫に追加
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedImage(null)
                        setDetectedItems([])
                      }}
                      variant="outline"
                      size="lg"
                      className="border-2"
                    >
                      やり直す
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
