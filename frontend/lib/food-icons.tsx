export const foodIcons: Record<string, string> = {
  // 野菜
  トマト: "🍅",
  にんじん: "🥕",
  ブロッコリー: "🥦",
  レタス: "🥬",
  きゅうり: "🥒",
  なす: "🍆",
  ピーマン: "🫑",
  とうもろこし: "🌽",
  じゃがいも: "🥔",
  たまねぎ: "🧅",

  // 果物
  りんご: "🍎",
  バナナ: "🍌",
  オレンジ: "🍊",
  レモン: "🍋",
  いちご: "🍓",
  ぶどう: "🍇",
  すいか: "🍉",
  もも: "🍑",

  // タンパク質
  卵: "🥚",
  肉: "🥩",
  鶏肉: "🍗",
  魚: "🐟",
  エビ: "🦐",

  // 乳製品
  牛乳: "🥛",
  チーズ: "🧀",
  バター: "🧈",

  // その他
  パン: "🍞",
  ご飯: "🍚",
  パスタ: "🍝",

  // デフォルト
  default: "🥘",
}

export function getFoodIcon(foodName: string): string {
  for (const [key, icon] of Object.entries(foodIcons)) {
    if (foodName.includes(key)) {
      return icon
    }
  }
  return foodIcons.default
}
