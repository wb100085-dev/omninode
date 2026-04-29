-- =====================================================
-- SocialTwin Blog: Supabase 테이블 설정
-- 사용법: Supabase 대시보드 → SQL Editor → New Query
--         아래 전체를 붙여넣고 Run 클릭
-- =====================================================

-- 1. 테이블 생성
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id           text        PRIMARY KEY,
  title        text        NOT NULL DEFAULT '',
  excerpt      text        NOT NULL DEFAULT '',
  content      text        NOT NULL DEFAULT '',
  content_type text        NOT NULL DEFAULT 'markdown',
  author       text        NOT NULL DEFAULT 'OmniNode',
  date         date,
  tags         text[]      NOT NULL DEFAULT '{}',
  image_url    text        NOT NULL DEFAULT '',
  featured     boolean     NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- 2. RLS(행 수준 보안) 활성화
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 3. 방문자: 읽기 허용
CREATE POLICY "public_select" ON public.blog_posts
  FOR SELECT USING (true);

-- 4. Admin 패널(anon 키): 쓰기 허용
--    (프론트엔드 비밀번호로 admin 패널 접근이 이미 보호됨)
CREATE POLICY "anon_insert" ON public.blog_posts
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update" ON public.blog_posts
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete" ON public.blog_posts
  FOR DELETE TO anon USING (true);
