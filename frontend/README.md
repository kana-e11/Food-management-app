# 冷蔵庫管理アプリ

PC画面に最適化された、淡い色調の可愛らしい冷蔵庫管理Webアプリケーションです。

## 機能

### 1. 画像アップロード機能
冷蔵庫内の写真をアップロードすると、物体検出モデル（YOLOv8対応準備済み）を用いて食材を自動検出・登録します。

### 2. 食材在庫管理機能
検出・登録された食材の賞味期限や数量を手動で追加・修正できます。

### 3. 料理レシピ提案機能
登録された食材情報をもとに、作れる料理を自動的に提案します（外部API統合準備済み）。

### 4. 食材・料理履歴閲覧・管理機能
過去に登録した食材の履歴や作成した料理の履歴を、イラスト付きで閲覧・管理できます。

## セットアップ方法

### 前提条件
- Node.js 18.x以上
- npm、yarn、またはpnpm

### インストール手順

1. プロジェクトをダウンロードまたはクローン

2. 依存関係をインストール
\`\`\`bash
npm install
# または
yarn install
# または
pnpm install
\`\`\`

3. 開発サーバーを起動
\`\`\`bash
npm run dev
# または
yarn dev
# または
pnpm dev
\`\`\`

4. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## VS Codeでの開発

このプロジェクトはVS Codeで完全に対応しています。

### 推奨拡張機能
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### VS Codeで開く
\`\`\`bash
code .
\`\`\`

## プロジェクト構造

\`\`\`
├── app/                    # Next.js App Router
│   ├── page.tsx           # ホーム（画像アップロード）
│   ├── inventory/         # 在庫管理ページ
│   ├── recipes/           # レシピ提案ページ
│   ├── history/           # 履歴管理ページ
│   ├── layout.tsx         # ルートレイアウト
│   └── globals.css        # グローバルスタイル
├── components/            # Reactコンポーネント
│   ├── navigation.tsx     # ナビゲーションバー
│   └── ui/               # shadcn/ui コンポーネント
├── lib/                   # ユーティリティ
│   ├── types.ts          # TypeScript型定義
│   ├── storage.ts        # localStorageヘルパー
│   └── food-icons.tsx    # 食材アイコンコンポーネント
└── public/               # 静的ファイル
\`\`\`

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **UIコンポーネント**: shadcn/ui
- **アイコン**: Lucide React
- **ストレージ**: localStorage（クライアントサイド）

## カスタマイズ

### 物体検出モデルの統合
`app/page.tsx`の`detectFoodItems`関数を実際のYOLOv8モデルと統合できます。

### 外部レシピAPIの統合
`app/recipes/page.tsx`のモックデータを実際のレシピAPIと置き換えることができます。

### データベースの統合
現在はlocalStorageを使用していますが、Supabase、Neon、その他のデータベースと統合可能です。

## ビルド

本番環境用にビルド:
\`\`\`bash
npm run build
npm start
\`\`\`

## デプロイ

Vercelへのデプロイが推奨されます:
\`\`\`bash
vercel
\`\`\`

## ライセンス

MIT
