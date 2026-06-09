-- ============================================================
-- 블로그 이미지 영구 호스팅용 Supabase Storage 설정
-- Supabase Dashboard → SQL Editor 에 그대로 붙여넣고 RUN.
-- 모두 멱등(idempotent) — 여러 번 실행해도 안전.
-- ============================================================

-- 1) 공개 버킷 생성 (이미 있으면 설정만 갱신)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,                                   -- public: 공개 URL 로 누구나 읽기 가능
  10485760,                               -- 파일당 최대 10MB
  array['image/png','image/jpeg','image/jpg','image/gif','image/webp','image/svg+xml','image/avif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 2) 공개 읽기 정책 (public 버킷이라 공개 URL 은 열리지만, select 정책도 명시)
drop policy if exists "blog-images public read" on storage.objects;
create policy "blog-images public read"
  on storage.objects for select
  using ( bucket_id = 'blog-images' );

-- 3) 업로드 허용 — 관리자 페이지가 anon(publishable) 키로 업로드하므로 anon 에 INSERT 허용
drop policy if exists "blog-images upload" on storage.objects;
create policy "blog-images upload"
  on storage.objects for insert
  to anon, authenticated
  with check ( bucket_id = 'blog-images' );

-- 4) 덮어쓰기/삭제 허용 (같은 파일명 재업로드·정리용)
drop policy if exists "blog-images update" on storage.objects;
create policy "blog-images update"
  on storage.objects for update
  to anon, authenticated
  using ( bucket_id = 'blog-images' )
  with check ( bucket_id = 'blog-images' );

drop policy if exists "blog-images delete" on storage.objects;
create policy "blog-images delete"
  on storage.objects for delete
  to anon, authenticated
  using ( bucket_id = 'blog-images' );
