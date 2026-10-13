-- 勉強がんばるアプリ（ことばナビ・さんすうナビ・やること）Supabaseテーブル定義
-- 本番DB（project: ydxgwijjpmpfaqkhmuov）の現在の状態に合わせた一覧。2026-10-13 更新。
-- ログインなし（anon）で使うアプリのため、RLSは有効にしたうえで anon に読み書きを許可している。
-- 新しく作るときは上から順に実行する。既存DBの変更は apply_migration で行い、このファイルも合わせて直す。

-- =========================================
-- ことばナビ
-- =========================================

-- 問題本体
create table questions (
  id bigint generated always as identity primary key,
  category text not null,               -- ことわざ / 慣用句 / 類義語 / 対義語 / 四字熟語 / 同音異義語 など
  answer_type text not null check (answer_type in (
    'self_recall',         -- 意味 → 答え（自己採点）
    'synonym_forward',     -- 似た意味のことわざ（上段→下段）
    'synonym_reverse',     -- 似た意味のことわざ（下段→上段）
    'fill_blank',          -- 穴埋め例文＋意味 → 答え（慣用句・四字熟語）
    'pair_fill',           -- 二文穴埋め（類義語・対義語）
    'antonym_pair',        -- 対になる表現（二文）
    'synonym_pair',        -- 類義語（二文穴埋め）
    'wago_fill',           -- 和語（穴埋め）
    'meaning_first_fill',  -- 意味 → 穴埋め例文
    'choice'               -- 同音異義語・同訓異字（選択式・自動採点）
  )),
  content jsonb not null,               -- 出題形式ごとの表示・正解データ（下記）
  source_book text,                     -- インプット問題集の名前
  source_page text,                     -- ページ（例: "12-13"）
  last_correct boolean,                 -- 最後の正解/不正解（null=未回答）
  last_answered_at timestamptz,
  correct_count integer not null default 0,   -- 累計正解回数（記録用。減らない）
  streak_count integer not null default 0,    -- 連続正解数（定着判定用。不正解で0にリセット。4で「完璧」）
  wrong_count integer not null default 0,     -- 不正解回数（3回以上で「苦手」→克服の演出）
  created_at timestamptz not null default now()
);
create index idx_questions_category on questions(category);
create index idx_questions_source_book on questions(source_book);
create index idx_questions_correct_count on questions(correct_count);

-- content jsonb の形（src/lib/questionTypes.js の TYPE_GROUPS と対応）
--   self_recall / fill_blank / wago_fill / meaning_first_fill:
--     { "sentence": "穴埋め例文（self_recallはなし。HTMLの部分ヒントを含めてよい）", "q": "意味", "a": "答え" }
--   synonym_forward / synonym_reverse:
--     { "q": "意味", "shown": "表示することわざ", "a": ["答え1", "答え2"] }
--   pair_fill / antonym_pair / synonym_pair:
--     { "sentenceA": "例文1", "answerA": "答え1", "sentenceB": "例文2", "answerB": "答え2" }
--   choice:
--     { "reading": "カタカナ読み", "sentence": "穴埋め例文", "choices": ["選択肢1","選択肢2"], "answer": "正解" }

-- 問題集
create table question_sets (
  id bigint generated always as identity primary key,
  name text not null,
  filter_condition jsonb,               -- 抽出条件のスナップショット
  goal_at timestamptz,                  -- 全問記憶の目標日（任意。「今日やる問題」の抽出に使う）
  sort_order integer not null default 0,     -- 子どもアプリでの表示順
  reviewed boolean not null default false,   -- 管理画面のプレビューで確認ずみ
  shuffle boolean not null default true,     -- 開くたびに順番を入れかえる
  created_at timestamptz not null default now()
);
-- filter_condition の形: { source_book, category, answer_type, page_from, page_to, max_correct_count, max_streak_count }（指定なしは null）

-- 問題集と問題の紐付け（多対多）
create table question_set_items (
  question_set_id bigint not null references question_sets(id) on delete cascade,
  question_id bigint not null references questions(id) on delete cascade,
  position integer not null default 0,
  primary key (question_set_id, question_id)
);
create index idx_qsi_set on question_set_items(question_set_id);
create index idx_qsi_question on question_set_items(question_id);

-- 回答履歴。集計値（questions の correct_count など）はアプリ側（src/lib/api.js recordAnswer）で更新する。
-- session_type='review'（間違えた問題の復習）は集計値に反映しない。
create table answer_logs (
  id bigint generated always as identity primary key,
  question_id bigint not null references questions(id) on delete cascade,
  question_set_id bigint references question_sets(id) on delete set null,
  session_type text not null default 'main' check (session_type in ('main', 'review')),
  is_correct boolean not null,
  answered_at timestamptz not null default now()
);
create index idx_answer_logs_question_id on answer_logs(question_id);
create index idx_answer_logs_answered_at on answer_logs(answered_at);

-- 問題集作成時の抽出条件の履歴
create table filter_history (
  id bigint generated always as identity primary key,
  name text not null,
  filter_condition jsonb not null,
  result_count integer not null,
  created_at timestamptz not null default now()
);

-- ふりがな辞書（管理画面から追加する分。src/lib/furigana.js の組み込み辞書に上書きでマージ）
create table furigana_entries (
  id bigint generated always as identity primary key,
  word text not null unique,
  reading text not null,
  created_at timestamptz not null default now()
);

-- =========================================
-- ごほうび（子ども1人ぶん。1行だけ）
-- =========================================
create table user_progress (
  id bigint primary key default 1 constraint single_row check (id = 1),
  points integer not null default 0,
  streak_count integer not null default 0,          -- 連続日数
  longest_streak integer not null default 0,
  freeze_tokens integer not null default 1,         -- 1日休んでも連続が切れない「フリーズ」
  last_activity_date date,                          -- 最後に勉強した日（端末のローカル日付）
  weekly_correct_count integer not null default 0,  -- 今週のミッションの進み（正解1問=1）
  week_start_date date,                             -- 今週の月曜日
  weekly_missions_claimed text[] not null default '{}',
  mastery_event_total integer not null default 0,   -- すごろく：習得した数の合計
  owned_items text[] not null default '{}',         -- 'キャラID:アイテムID'
  equipped_item text,
  active_character text not null default 'fox',
  unlocked_characters text[] not null default '{fox}',
  unlocked_backgrounds text[] not null default '{coast}',
  active_background text,
  updated_at timestamptz not null default now()
);

-- ポイントの増減の履歴（きろく画面の「ポイントのきろく」）
create table point_logs (
  id bigint generated always as identity primary key,
  source text not null check (source in ('kotoba','sansu','task','bonus','mission','other')),
  delta integer not null,
  label text,
  created_at timestamptz not null default now()
);
create index point_logs_created_at_idx on point_logs (created_at desc);

-- =========================================
-- やること（ホーム）
-- =========================================
create table tasks (
  id uuid primary key default gen_random_uuid(),
  subject text not null check (subject in ('算数','国語','理科','社会')),
  title text not null check (char_length(btrim(title)) > 0),
  due_date date not null,
  frequency text not null default 'once' check (frequency in ('once','daily','weekly','monthly')),
  weekdays smallint[] not null default '{}' check (weekdays <@ array[0,1,2,3,4,5,6]::smallint[]), -- 0=日..6=土
  end_date date,
  is_active boolean not null default true,
  sort_order integer not null default 0,             -- 管理画面での並び順（1始まり）
  link_to text check (link_to in ('kotoba', 'sansu')), -- ホームの「始める」ボタンで開くアプリ
  points integer not null default 100 check (points in (10,50,100,150,200)),
  auto_complete boolean not null default false,      -- 連動するアプリの学習を終えたら自動で完了にする
  created_at timestamptz not null default now(),
  check (end_date is null or end_date >= due_date)
);
create index tasks_sort_order_idx on tasks (sort_order);

create table task_completions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  occurrence_date date not null,                     -- どの日の分を終えたか
  completed_at timestamptz not null default now(),
  points_awarded integer not null default 5,         -- 完了したときに付けたポイント（取り消しで正確に戻すため）
  unique (task_id, occurrence_date)
);
create index task_completions_occurrence_idx on task_completions (occurrence_date);

-- イベント（テスト・行事などの目標日。ホームと管理画面の予定カレンダーに表示）
create table milestones (
  id bigint generated always as identity primary key,
  event_date date not null,
  title text not null,
  created_at timestamptz not null default now()
);
create index milestones_event_date_idx on milestones (event_date);

-- =========================================
-- さんすうナビ
-- =========================================
create table sansu_questions (
  id bigint generated always as identity primary key,
  unit text not null,                                -- 単元
  difficulty text not null default 'normal',         -- 'easy' | 'normal' | 'hard'
  question_text text not null,
  answer text,
  image_url text,                                    -- 旧形式（未使用。image_urls に移行ずみ）
  image_urls text[] not null default '{}',
  answer_image_urls text[] not null default '{}',
  source_name text,                                  -- テスト／教材名
  page_number text,
  consecutive_correct integer not null default 0,
  is_mastered boolean not null default false,        -- 3回連続正解で習得
  last_answered_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_sansu_questions_unit on sansu_questions(unit);
create index idx_sansu_questions_difficulty on sansu_questions(difficulty);

create table sansu_answer_logs (
  id bigint generated always as identity primary key,
  question_id bigint not null references sansu_questions(id) on delete cascade,
  is_correct boolean not null,
  answered_at timestamptz not null default now()
);
create index idx_sansu_answer_logs_question_id on sansu_answer_logs(question_id);

-- 管理画面の「単元」「教材名」の選択肢
create table sansu_meta_options (
  id bigint generated always as identity primary key,
  option_type text not null check (option_type in ('unit', 'source')),
  name text not null,
  created_at timestamptz not null default now(),
  unique (option_type, name)
);
-- 画像は Storage のバケット 'sansu-images'（公開）に保存する

-- =========================================
-- RLS（すべてのテーブルで有効。ログインなしのため anon に許可）
-- =========================================
alter table questions enable row level security;
alter table question_sets enable row level security;
alter table question_set_items enable row level security;
alter table answer_logs enable row level security;
alter table filter_history enable row level security;
alter table furigana_entries enable row level security;
alter table user_progress enable row level security;
alter table point_logs enable row level security;
alter table tasks enable row level security;
alter table task_completions enable row level security;
alter table milestones enable row level security;
alter table sansu_questions enable row level security;
alter table sansu_answer_logs enable row level security;
alter table sansu_meta_options enable row level security;

create policy "questions_allow_all" on questions for all using (true) with check (true);
create policy "question_sets_allow_all" on question_sets for all using (true) with check (true);
create policy "question_set_items_allow_all" on question_set_items for all using (true) with check (true);
create policy "answer_logs_allow_all" on answer_logs for all using (true) with check (true);
create policy "filter_history_allow_all" on filter_history for all using (true) with check (true);
create policy "furigana_entries_allow_all" on furigana_entries for all using (true) with check (true);
create policy "user_progress_allow_all" on user_progress for all using (true) with check (true);
create policy "sansu_questions_allow_all" on sansu_questions for all using (true) with check (true);
create policy "sansu_answer_logs_allow_all" on sansu_answer_logs for all using (true) with check (true);
create policy "sansu_meta_options_allow_all" on sansu_meta_options for all using (true) with check (true);

create policy "point_logs anon select" on point_logs for select to anon, authenticated using (true);
create policy "point_logs anon insert" on point_logs for insert to anon, authenticated with check (true);

create policy "tasks_all_authenticated" on tasks for all to authenticated using (true) with check (true);
create policy "tasks_select_anon" on tasks for select to anon using (true);
create policy "tasks_insert_anon" on tasks for insert to anon with check (true);
create policy "tasks_update_anon" on tasks for update to anon using (true) with check (true);
create policy "tasks_delete_anon" on tasks for delete to anon using (true);

create policy "completions_all_authenticated" on task_completions for all to authenticated using (true) with check (true);
create policy "completions_select_anon" on task_completions for select to anon using (true);
create policy "completions_insert_anon" on task_completions for insert to anon with check (true);
create policy "completions_delete_anon" on task_completions for delete to anon using (true);

create policy "milestones anon select" on milestones for select to anon, authenticated using (true);
create policy "milestones anon insert" on milestones for insert to anon, authenticated with check (true);
create policy "milestones anon update" on milestones for update to anon, authenticated using (true) with check (true);
create policy "milestones anon delete" on milestones for delete to anon, authenticated using (true);

-- =========================================
-- 関数
-- =========================================
-- 勉強した日（ことばナビ・さんすう・やること完了）の一覧。きろくのカレンダー用（日本時間の日付）
create or replace function public.get_activity_dates() returns table(activity_date date)
language sql stable set search_path to 'public' as $$
  select d as activity_date from (
    select (answered_at at time zone 'Asia/Tokyo')::date as d from answer_logs
    union
    select (answered_at at time zone 'Asia/Tokyo')::date as d from sansu_answer_logs
    union
    select (completed_at at time zone 'Asia/Tokyo')::date as d from task_completions
  ) t
  order by d;
$$;
