# 勉強がんばるアプリ

小学5年生向けの学習アプリ。ホームの「今日のやること」から、ことばナビ（国語のことば）・さんすうナビへ移動できる。子ども1人・ログインなし。

| URL | 内容 |
|---|---|
| `/` | ホーム（今日のやること）。下のメニューで ことば／さんすう／きろく／ショップ へ移動 |
| `/sansu` | さんすうナビを直接開く（ブックマーク用） |
| `/admin` | 管理画面（ホーム：やること・イベント／ことばナビ） |
| `/admin/sansu` | さんすうナビの問題登録（管理画面とCSSが衝突するため別ページ） |

## 構成

- React 18 + Vite 5（SPA。`vercel.json` で全パスを `index.html` へ）
- Supabase（テーブル定義は `supabase/schema.sql`）
- デプロイ: Vercel（`main` に push すると自動デプロイ）

## セットアップ

1. `npm install`
2. `.env.example` を `.env` にコピーし、Supabase の `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` を設定（Vercel の Environment Variables にも同じものを設定）
3. `npm run dev`

## ソースの構成

```
src/
  lib/                      画面に依存しない処理（ここを先に見る）
    supabase.js / db.js     Supabase の接続、ページ分け取得（fetchAllRows）・エラー処理（run）
    api.js                  ことばナビ・ごほうび（user_progress / point_logs）・ふりがな辞書
    tasks.js                やること（今日の分の計算、くり返し、自動完了）・イベント
    sansuApi.js             さんすうナビ（子ども画面・管理画面）
    today.js                「今日やる問題」の抽出、定着度（箱）の計算
    gamification.js         ポイントのルール（POINTS）、称号・ミッション・すごろく・キャラクター
    shopItems.js            ショップのアイテム（データ）
    questionTypes.js        ことばナビの出題形式（ラベル・要約・絞り込み・CSV取り込み）
    dates.js                日付（ローカル日付の 'YYYY-MM-DD' で扱う）
    storage.js              localStorage（キー名の一覧 STORAGE_KEYS）
    utils.js / sound.js / furigana.js
  components/
    common/                 読み込み中・エラー表示
    kids/                   子ども画面
      KidsApp.jsx           画面の切りかえと、学習 → ごほうびのつなぎ役
      useProgress.js        ごほうびの記録（ポイント・連続日数・ミッション・すごろく・ショップ）
      useRewardChecks.js    問題集の完成・バッジ・「完璧」の判定
      kotoba/               ことばナビ（問題集の選択・出題カード・結果・出題の進み方）
      SansuScreen.jsx       さんすうナビ
      Character.jsx         キャラクター（絵は characterBodies.jsx / characterItems.jsx）
    admin/                  管理画面（kotoba/ にことばナビの各タブ）
    sansu/                  さんすうナビの問題登録（/admin/sansu）
```

- 子ども画面の問題カード（`kids/kotoba/QuizCard.jsx`）は、管理画面のプレビューでも同じものを使う。
- ポイントの値は `lib/gamification.js` の `POINTS`、やることのポイントは `lib/tasks.js` にまとめている。

## 「今日やる問題」

`src/lib/today.js` に、目標日と学習履歴（`streak_count`）から今日解くべき問題を自動抽出するロジックがある。
締切までの残り日数に応じて3段階（7日/14日/30日）の優先度を設け、緊急度が高いものは独占可、それ以外は問題集ごとに均等割りする。
