/*
  # Alpine Essence Soap E-Commerce Schema

  1. New Tables
    - `categories`: Product categories for soap types
    - `products`: Core product catalog with pricing and inventory
    - `product_images`: Product images for gallery
    - `product_translations`: Multi-language support for product content
    - `newsletter_subscribers`: Email list for marketing

  2. Security
    - Enable RLS on all tables
    - Public read access for products and categories
    - Public insert for newsletter subscribers
    - No authentication required for MVP

  3. Features
    - Products include price, stock, featured flag
    - Support for multiple images per product
    - Multi-language content (DE, FR, EN)
    - Featured products for homepage display
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id),
  price numeric NOT NULL,
  stock integer DEFAULT 10,
  featured boolean DEFAULT false,
  skin_types text[] DEFAULT '{}',
  scents text[] DEFAULT '{}',
  ingredients text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  language_code text NOT NULL,
  name text,
  description text,
  how_to_use text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, language_code)
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  language_preference text DEFAULT 'en',
  subscribed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access to products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access to product images"
  ON product_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access to product translations"
  ON product_translations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public insert for newsletter subscribers"
  ON newsletter_subscribers FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public read newsletter subscribers"
  ON newsletter_subscribers FOR SELECT
  TO public
  USING (false);
