# ProjectFlow - プロジェクト管理ツール

シンプルで使いやすいプロジェクト管理ツールです。

## 機能

- プロジェクト一覧表示とフィルタリング
- プロジェクト詳細画面
- タスク管理（作成、ステータス更新）
- 進捗率の自動計算
- レスポンシブデザイン

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build
```

## GitHub Pagesへのデプロイ

### 初回セットアップ

1. GitHubに新しいリポジトリ `project-tool` を作成

2. リポジトリをローカルと連携:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/project-tool.git
git push -u origin main
```

3. GitHubリポジトリの設定:
   - Settings → Pages
   - Source: GitHub Actions を選択

4. 自動デプロイが完了すると、以下のURLでアクセス可能:
   - `https://あなたのユーザー名.github.io/project-tool/`

### 手動デプロイ（オプション）

```bash
npm run deploy
```

## 技術スタック

- React 18
- TypeScript
- Vite
- Lucide React (アイコン)
