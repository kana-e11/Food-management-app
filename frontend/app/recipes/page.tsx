"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Clock, Loader2, Sparkles } from "lucide-react"
import { storage } from "@/lib/storage"
import type { FoodItem, Recipe } from "@/lib/types"

export default function RecipesPage() {
  const [items, setItems] = useState<FoodItem[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    const loadedItems = storage.getFoodItems()
    setItems(loadedItems)
  }, [])

  const generateRecipes = async () => {
    setIsLoading(true)

    // Simulate API call to recipe service
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const ingredientNames = items.map((item) => item.name)

    // Mock recipe data based on available ingredients
    const mockRecipes: Recipe[] = [
      {
        id: "1",
        title: "野菜炒め",
        ingredients: ["にんじん", "たまねぎ", "ピーマン", "醤油", "ごま油"],
        instructions:
          "1. 野菜を一口大に切ります\n2. フライパンにごま油を熱します\n3. 野菜を炒めて醤油で味付けします\n4. 全体に火が通ったら完成です",
        imageUrl: "/stir-fried-vegetables.jpg",
        prepTime: 10,
        cookTime: 15,
      },
      {
        id: "2",
        title: "トマトサラダ",
        ingredients: ["トマト", "レタス", "きゅうり", "オリーブオイル", "塩"],
        instructions:
          "1. トマトとキュウリを薄切りにします\n2. レタスを一口大にちぎります\n3. ボウルに野菜を入れます\n4. オリーブオイルと塩で味付けして完成です",
        imageUrl: "/fresh-tomato-salad.jpg",
        prepTime: 5,
        cookTime: 0,
      },
      {
        id: "3",
        title: "オムレツ",
        ingredients: ["卵", "牛乳", "塩", "バター"],
        instructions:
          "1. 卵を溶いて牛乳と塩を加えます\n2. フライパンにバターを溶かします\n3. 卵液を流し入れて弱火で焼きます\n4. 半熟になったら折りたたんで完成です",
        imageUrl: "/fluffy-omelette.jpg",
        prepTime: 5,
        cookTime: 10,
      },
      {
        id: "4",
        title: "にんじんスープ",
        ingredients: ["にんじん", "たまねぎ", "牛乳", "バター", "塩"],
        instructions:
          "1. にんじんとたまねぎを薄切りにします\n2. バターで野菜を炒めます\n3. 水を加えて柔らかくなるまで煮ます\n4. ミキサーで滑らかにして牛乳を加え、塩で味を調えます",
        imageUrl: "/creamy-carrot-soup.jpg",
        prepTime: 10,
        cookTime: 20,
      },
    ]

    setRecipes(mockRecipes)
    setIsLoading(false)
  }

  const handleCookRecipe = (recipe: Recipe) => {
    storage.addHistory({
      id: crypto.randomUUID(),
      type: "recipe",
      name: recipe.title,
      date: new Date().toISOString(),
    })

    alert(`「${recipe.title}」を作りました！履歴に追加されました。`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">レシピ提案</h2>
          <p className="text-lg text-muted-foreground mb-6">在庫の食材から作れる料理を提案します</p>

          {items.length === 0 ? (
            <Card className="p-8 max-w-md mx-auto">
              <p className="text-muted-foreground">食材を登録すると、レシピを提案できます</p>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="p-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">利用可能な食材</h3>
                  <Badge variant="secondary">{items.length}個</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.slice(0, 10).map((item) => (
                    <Badge key={item.id} variant="outline" className="text-sm">
                      {item.name}
                    </Badge>
                  ))}
                  {items.length > 10 && <Badge variant="outline">他 {items.length - 10}個</Badge>}
                </div>
              </Card>

              {recipes.length === 0 && (
                <Button
                  onClick={generateRecipes}
                  disabled={isLoading}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      レシピを検索中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      レシピを提案
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        {recipes.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground">おすすめレシピ ({recipes.length}件)</h3>
              <Button onClick={generateRecipes} variant="outline" disabled={isLoading}>
                再検索
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recipes.map((recipe) => (
                <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-muted">
                    <img
                      src={recipe.imageUrl || "/placeholder.svg"}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-2">{recipe.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {recipe.prepTime !== undefined && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>準備: {recipe.prepTime}分</span>
                          </div>
                        )}
                        {recipe.cookTime !== undefined && (
                          <div className="flex items-center gap-1">
                            <ChefHat className="w-4 h-4" />
                            <span>調理: {recipe.cookTime}分</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">材料:</p>
                      <div className="flex flex-wrap gap-2">
                        {recipe.ingredients.map((ingredient, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => setSelectedRecipe(recipe)} variant="outline" className="flex-1">
                        詳細を見る
                      </Button>
                      <Button
                        onClick={() => handleCookRecipe(recipe)}
                        className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        作った
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedRecipe && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedRecipe(null)}
          >
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative h-64 bg-muted">
                <img
                  src={selectedRecipe.imageUrl || "/placeholder.svg"}
                  alt={selectedRecipe.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-4">{selectedRecipe.title}</h3>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    {selectedRecipe.prepTime !== undefined && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span>準備: {selectedRecipe.prepTime}分</span>
                      </div>
                    )}
                    {selectedRecipe.cookTime !== undefined && (
                      <div className="flex items-center gap-2">
                        <ChefHat className="w-5 h-5" />
                        <span>調理: {selectedRecipe.cookTime}分</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">材料</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <Badge key={index} variant="secondary">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">作り方</h4>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-foreground whitespace-pre-line leading-relaxed">{selectedRecipe.instructions}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleCookRecipe(selectedRecipe)}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    作った
                  </Button>
                  <Button onClick={() => setSelectedRecipe(null)} variant="outline" className="flex-1">
                    閉じる
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
