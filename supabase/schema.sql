-- ことばナビ Supabaseテーブル設計
-- 作成日: 2026-07-25

-- =========================================
-- 1. questions（問題本体）
-- =========================================
create table questions (
  id bigint generated always as identity primary key,
  category text not null,               -- ことわざ / 慣用句 / 類義語 / 対義語 / 四字熟語 / 同音異義語
  answer_type text not null check (answer_type in (
    'self_recall',       -- ことわざ（自己採点）
    'synonym_forward',   -- ことわざ（似た意味・上段→下段）
    'synonym_reverse',   -- ことわざ（似た意味・下段→上段）
    'fill_blank',        -- 慣用句（穴埋め）/ 四字熟語（部分ヒント）共通
    'pair_fill',         -- 類義語・対義語（二文穴埋め）
    'choice'             -- 同音異義語（選択式）
  )),
  content jsonb not null,               -- パターン別の表示・正解データ（下記参照）
  source_book text,                     -- インプット問題集の名前
  source_page text,                     -- ページ（例: "12-13"）
  last_correct boolean,                 -- 最後の正解/不正解（null=未回答）
  last_answered_at timestamptz,
  correct_count integer not null default 0,   -- 累計正解回数（記録用。減らない）
  streak_count integer not null default 0,    -- 連続正解数（定着判定用。不正解で0にリセット）
  created_at timestamptz not null default now()
);

alter table questions enable row level security;
create policy "questions_allow_all" on questions
  for all using (true) with check (true);

create index idx_questions_category on questions(category);
create index idx_questions_source_book on questions(source_book);
create index idx_questions_correct_count on questions(correct_count);

-- content jsonb の形（answer_typeごと。フロント側のカードデータとほぼ同じ形）
--
-- self_recall:
--   { "q": "意味", "a": "答え", "shown": null }
--
-- synonym_forward / synonym_reverse:
--   { "q": "意味", "shown": "表示することわざ", "a": ["答え1", "答え2"] }
--
-- fill_blank:
--   { "sentence": "穴埋め例文（部分ヒントはHTML/記号を含めてよい）", "q": "意味", "a": "答え" }
--
-- pair_fill:
--   { "sentenceA": "例文1", "answerA": "答え1", "sentenceB": "例文2", "answerB": "答え2" }
--
-- choice:
--   { "reading": "カタカナ読み", "sentence": "穴埋め例文", "choices": ["選択肢1","選択肢2","選択肢3"], "answer": "正解" }


-- =========================================
-- 2. question_sets（問題集）
-- =========================================
create table question_sets (
  id bigint generated always as identity primary key,
  name text not null,                   -- 例:「言葉ナビ上巻 ことわざ P.12〜20 累計正解2回以下」
  filter_condition jsonb,               -- 抽出条件のスナップショット（下記参照）
  goal_at timestamptz,                  -- 全問記憶の目標日時（任意）
  created_at timestamptz not null default now()
);

alter table question_sets enable row level security;
create policy "question_sets_allow_all" on question_sets
  for all using (true) with check (true);

-- filter_condition jsonb の形
--   {
--     "source_book": "言葉ナビ上巻",
--     "category": "ことわざ",
--     "page_from": 12,
--     "page_to": 20,
--     "max_correct_count": 2
--   }
-- （指定なしの項目は null または省略）


-- =========================================
-- 3. question_set_items（問題集と問題の紐付け）
-- =========================================
create table question_set_items (
  question_set_id bigint not null references question_sets(id) on delete cascade,
  question_id bigint not null references questions(id) on delete cascade,
  position integer not null default 0,
  primary key (question_set_id, question_id)
);

alter table question_set_items enable row level security;
create policy "question_set_items_allow_all" on question_set_items
  for all using (true) with check (true);

create index idx_qsi_set on question_set_items(question_set_id);
create index idx_qsi_question on question_set_items(question_id);


-- =========================================
-- 4. answer_logs（回答履歴）
-- =========================================
create table answer_logs (
  id bigint generated always as identity primary key,
  question_id bigint not null references questions(id) on delete cascade,
  question_set_id bigint references question_sets(id) on delete set null,
  session_type text not null default 'main' check (session_type in ('main', 'review')),
  is_correct boolean not null,
  answered_at timestamptz not null default now()
);

alter table answer_logs enable row level security;
create policy "answer_logs_allow_all" on answer_logs
  for all using (true) with check (true);

create index idx_answer_logs_question_id on answer_logs(question_id);
create index idx_answer_logs_answered_at on answer_logs(answered_at);

-- 集計値（questions.correct_count / streak_count / last_correct / last_answered_at）は
-- answer_logsへのINSERT後にアプリ側 or トリガーで更新する想定。
-- session_type='review' の回答は questions.correct_count / streak_count に反映しない
-- （復習の正解は正解数にカウントしない、という既存仕様どおり）。
--
-- 更新ルール（session_type='main'の場合）:
--   正解時: correct_count += 1, streak_count += 1
--   不正解時: correct_count は変えない（累計記録として残す）, streak_count = 0 にリセット
--
-- 「今日やる問題集」の抽出（ライトナー式の箱・復習間隔）は、
-- correct_count ではなく streak_count を基準にする。
-- 理由: correct_count は不正解を挟んでも増え続けるため、
-- 「正解・不正解・正解・不正解・正解」のような履歴でも累計3回になってしまい、
-- 定着が進んでいるように誤判定してしまうため。


-- =========================================
-- 5. filter_history（抽出条件の履歴）
-- =========================================
create table filter_history (
  id bigint generated always as identity primary key,
  name text not null,
  filter_condition jsonb not null,      -- question_sets.filter_conditionと同じ形
  result_count integer not null,
  created_at timestamptz not null default now()
);

alter table filter_history enable row level security;
create policy "filter_history_allow_all" on filter_history
  for all using (true) with check (true);
