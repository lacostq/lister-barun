import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Получаем избранные товары для главной страницы
 */
export async function getFeaturedProducts(lang: string = 'en') {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, 
      name, 
      slug, 
      price, 
      featured,
      product_images(image_url),
      product_translations(description, language_code)
    `)
    .eq('featured', true);

  if (error) {
    console.error('Supabase fetch error:', error);
    return [];
  }

  // Причесываем данные, чтобы фронтенд их понимал
  return (data || []).map((product: any) => ({
    ...product,
    image: product.product_images?.[0]?.image_url || '',
    description: product.product_translations?.find((t: any) => t.language_code === lang)?.description || 
                 product.product_translations?.[0]?.description || ''
  }));
}

/**
 * Получаем один товар по его уникальному слагу (для страницы продукта)
 */
export async function getProductBySlug(slug: string, lang: string = 'en') {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, name, slug, price,
      product_images(image_url),
      product_translations(description, ingredients, language_code)
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    images: data.product_images?.map((img: any) => img.image_url) || [],
    description: data.product_translations?.find((t: any) => t.language_code === lang)?.description || 
                 data.product_translations?.[0]?.description || '',
    ingredients: data.product_translations?.find((t: any) => t.language_code === lang)?.ingredients || ''
  };
}

/**
 * Получаем все товары для страницы магазина
 */
export async function getAllProducts(lang: string = 'en') {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, name, slug, price,
      product_images(image_url),
      product_translations(description, language_code)
    `);

  if (error) return [];

  return (data || []).map((product: any) => ({
    ...product,
    image: product.product_images?.[0]?.image_url || '',
    description: product.product_translations?.find((t: any) => t.language_code === lang)?.description || ''
  }));
}
