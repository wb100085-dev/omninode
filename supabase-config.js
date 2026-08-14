// Supabase public config
// anon key는 프론트엔드 공개용으로 설계된 키입니다
window.SUPABASE_URL = 'https://fygbajoxwnlgfemvuvbu.supabase.co';
window.SUPABASE_ANON_KEY = 'sb_publishable_wc5ShjaIjvtkMBYbmmucJQ_oMmV7ynQ';

window._supabaseClient = null;
window.getSupabaseClient = function () {
  if (!window._supabaseClient) {
    window._supabaseClient = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );
  }
  return window._supabaseClient;
};

// DB row (snake_case) → JS post object (camelCase)
window.postFromDB = function (row) {
  return {
    id: row.id,
    title: row.title || '',
    excerpt: row.excerpt || '',
    content: row.content || '',
    contentType: row.content_type === 'html' ? 'html' : undefined,
    author: row.author || '',
    date: row.date || '',
    tags: row.tags || [],
    imageUrl: row.image_url || '',
    featured: !!row.featured,
    published: row.published === undefined ? true : !!row.published
  };
};

// ── 블로그 카테고리 (blog.html 목록 · blog-admin.html 작성 폼 공용) ──
// 분류 우선순위: ① category 필드 또는 카테고리명과 같은 태그(예: "회사소식")
//              ② 제목 키워드  ③ 태그 키워드  ④ 기본값(연구 시리즈)
window.BLOG_CATEGORIES = [
  { key: 'news',     label: '회사 소식',    re: /수상|최우수|협약|MOU|보도|인터뷰|소식/i },
  { key: 'series',   label: '연구 시리즈',  re: /series|연구노트|방법론/i },
  { key: 'forecast', label: 'AI 예측 데모', re: /예측|데모|여론조사|선거|민심|시뮬레이션/ }
];
window.blogCategoryOf = function (post) {
  const cats = window.BLOG_CATEGORIES;
  const norm = s => (s || '').replace(/^#/, '').replace(/[\s·]/g, '');
  const explicit = norm(post.category);
  const tagNorms = (post.tags || []).map(norm);
  for (const c of cats) {
    const l = norm(c.label);
    if (explicit === l || explicit === c.key || tagNorms.includes(l)) return c;
  }
  for (const c of cats) { if (c.re && c.re.test(post.title || '')) return c; }
  const tagText = tagNorms.join(' ');
  for (const c of cats) { if (c.re && c.re.test(tagText)) return c; }
  return cats.find(c => c.key === 'series');
};

// 일반 방문자에게 노출할 게시물만 필터링 (비공개 제외)
window.filterPublicPosts = function (posts) {
  if (!Array.isArray(posts)) return [];
  return posts.filter(function (p) {
    return p && p.published !== false;
  });
};

// Supabase에서 전체 포스트 조회 (날짜 내림차순)
// 성공 시 배열 반환, 실패 시 null 반환 → 호출부에서 fallback 처리
window.fetchBlogPosts = async function () {
  try {
    const { data, error } = await window.getSupabaseClient()
      .from('blog_posts')
      .select('*')
      .order('date', { ascending: false });
    if (!error) return (data || []).map(window.postFromDB);
  } catch (e) {
    console.warn('[Supabase] fetchBlogPosts 실패:', e);
  }
  return null;
};
