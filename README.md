# ことばナビ

小学5年生向けの国語学習アプリ（ことわざ・慣用句・類義語/対義語・四字熟語・同音異義語）。

- 子ども用アプリ: `/`
- 親向け管理画面: `/admin`

## 構成

- React + Vite + Supabase
- デプロイ: Vercel
- DB: Supabase（東京リージョン / プロジェクト名 `kotoba-navi`）

## セットアップ

1. `npm install`
2. `.env.example` を `.env` にコピーし、Supabaseの `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` を設定
   （値は Supabaseダッシュボード > プロジェクト設定 > API から取得）
3. `npm run dev`

## デプロイ（Vercel）

1. このリポジトリをVercelにインポート
2. Vercelの Settings > Environment Variables に `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` を設定
3. デプロイ

## データベース

`supabase/schema.sql` にテーブル定義があります。Supabaseの SQL Editor で実行するか、
Supabase MCP経由で `apply_migration` してください（このプロジェクトではすでに適用済みです）。

テーブル構成:

- `questions` - 問題本体（`content` jsonbに出題パターン別のデータを格納）
- `question_sets` - 問題集（`goal_at`で目標日時を設定可能）
- `question_set_items` - 問題集と問題の紐付け（多対多）
- `answer_logs` - 回答履歴
- `filter_history` - 問題集作成時の抽出条件の履歴

## 出題パターン（answer_type）

| answer_type | 内容 |
|---|---|
| self_recall | ことわざ等、意味→答えの自己採点式 |
| synonym_forward / synonym_reverse | 似た意味のことわざ（答えが複数の場合あり） |
| fill_blank | 穴埋め例文＋意味→答え（慣用句・四字熟語で共用） |
| pair_fill | 二文穴埋め（類義語・対義語） |
| choice | 同音異義語の選択式（自動採点） |

## 「今日やる問題集」

`src/lib/today.js` に、目標日時と学習履歴（`streak_count`）から今日解くべき問題を
自動抽出するロジックがあります。締切までの残り日数に応じて3段階（7日/14日/30日）の
優先度を設け、緊急度が高いものは独占可、それ以外は問題集ごとに均等割りする設計です。
