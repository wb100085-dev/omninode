-- blog-admin-rls.sql
-- 목적: 블로그 발행을 "로그인한(authenticated) 관리자만" 가능하게 한다.
--   - 일반 방문자(anon, 공개 키): 발행된 글 '읽기'만.
--   - 로그인한 관리자(authenticated): 모든 글 읽기 + 쓰기/수정/삭제.
--   - 백엔드(service_role=sb_secret_): 모든 것(우회) — 영향 없음.
-- 선행: RLS_DIAGNOSE_AND_FIX.sql 을 먼저 실행해 둔 상태 가정(전체 차단 + blog_posts anon SELECT).
-- 실행: Supabase Dashboard → SQL Editor. 멱등(여러 번 실행 OK).

-- ── 1) 권한(GRANT) ─────────────────────────────────────────
grant select on public.blog_posts to anon;                       -- 방문자: 읽기
grant select, insert, update, delete on public.blog_posts to authenticated;  -- 관리자: 전체

-- ── 2) RLS 정책 ────────────────────────────────────────────
alter table public.blog_posts enable row level security;

-- 방문자: 발행된 글만 읽기
drop policy if exists "blog_posts public read"      on public.blog_posts;
drop policy if exists "blog_posts anon read"        on public.blog_posts;
create policy "blog_posts anon read"
  on public.blog_posts for select to anon
  using ( coalesce(published, true) = true );

-- 관리자(로그인): 모든 글 읽기(초안 포함)
drop policy if exists "blog_posts authd read"       on public.blog_posts;
create policy "blog_posts authd read"
  on public.blog_posts for select to authenticated
  using ( true );

-- 관리자(로그인): 쓰기/수정/삭제
drop policy if exists "blog_posts authd insert"     on public.blog_posts;
create policy "blog_posts authd insert"
  on public.blog_posts for insert to authenticated
  with check ( true );

drop policy if exists "blog_posts authd update"     on public.blog_posts;
create policy "blog_posts authd update"
  on public.blog_posts for update to authenticated
  using ( true ) with check ( true );

drop policy if exists "blog_posts authd delete"     on public.blog_posts;
create policy "blog_posts authd delete"
  on public.blog_posts for delete to authenticated
  using ( true );

-- ── 3) 이미지 스토리지(blog-images): 업로드/삭제도 로그인 관리자만 ──
-- 읽기는 공개 유지(공개 버킷). 기존 setup-storage.sql 이 anon 에도 쓰기를 열어둔 것을 닫는다.
drop policy if exists "blog-images upload" on storage.objects;
create policy "blog-images upload"
  on storage.objects for insert to authenticated
  with check ( bucket_id = 'blog-images' );

drop policy if exists "blog-images update" on storage.objects;
create policy "blog-images update"
  on storage.objects for update to authenticated
  using ( bucket_id = 'blog-images' )
  with check ( bucket_id = 'blog-images' );

drop policy if exists "blog-images delete" on storage.objects;
create policy "blog-images delete"
  on storage.objects for delete to authenticated
  using ( bucket_id = 'blog-images' );
-- (읽기 정책 "blog-images public read" 는 그대로 둔다 = 누구나 이미지 보기 가능)
