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
    featured: !!row.featured
  };
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
