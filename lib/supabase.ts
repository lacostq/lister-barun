import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  price: number;
  stock: number;
  featured: boolean;
  skin_types: string[];
  scents: string[];
  ingredients: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
}

export interface ProductTranslation {
  id: string;
  product_id: string;
  language_code: string;
  name: string;
  description: string;
  how_to_use: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export async function getProducts(language: string = 'en') {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('featured', { ascending: false });

  if (error) throw error;

  const enrichedProducts = await Promise.all(
    products.map(async (product) => {
      const [images, translation] = await Promise.all([
        getProductImages(product.id),
        getProductTranslation(product.id, language),
      ]);
      return {
        ...product,
        images,
        translation: translation || { name: product.name, description: '', how_to_use: '' },
      };
    })
  );

  return enrichedProducts;
}

export async function getFeaturedProducts(language: string = 'en') {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .limit(6);

  if (error) throw error;

  const enrichedProducts = await Promise.all(
    products.map(async (product) => {
      const [images, translation] = await Promise.all([
        getProductImages(product.id),
        getProductTranslation(product.id, language),
      ]);
      return {
        ...product,
        images,
        translation: translation || { name: product.name, description: '', how_to_use: '' },
      };
    })
  );

  return enrichedProducts;
}

export async function getProductBySlug(slug: string, language: string = 'en') {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  if (!product) return null;

  const [images, translation, relatedProducts] = await Promise.all([
    getProductImages(product.id),
    getProductTranslation(product.id, language),
    getRelatedProducts(product.id, product.category_id, language),
  ]);

  return {
    ...product,
    images,
    translation: translation || { name: product.name, description: '', how_to_use: '' },
    relatedProducts,
  };
}

export async function getProductImages(productId: string) {
  const { data: images, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return images || [];
}

export async function getProductTranslation(
  productId: string,
  languageCode: string = 'en'
) {
  const { data: translation, error } = await supabase
    .from('product_translations')
    .select('*')
    .eq('product_id', productId)
    .eq('language_code', languageCode)
    .maybeSingle();

  if (error) throw error;
  return translation || null;
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  language: string = 'en'
) {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .not('id', 'eq', productId)
    .limit(4);

  if (error) throw error;

  const enrichedProducts = await Promise.all(
    (products || []).map(async (product) => {
      const images = await getProductImages(product.id);
      const translation = await getProductTranslation(product.id, language);
      return {
        ...product,
        images,
        translation: translation || { name: product.name, description: '', how_to_use: '' },
      };
    })
  );

  return enrichedProducts;
}

export async function getCategories() {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return categories || [];
}

export async function subscribeToNewsletter(email: string, language: string = 'en') {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert([
      {
        email,
        language_preference: language,
      },
    ]);

  if (error) throw error;
  return data;
}
