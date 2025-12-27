/*
  # Seed Alpine Essence Product Data

  1. Insert Categories
  2. Insert Products with pricing and metadata
  3. Insert Product Images from Pexels
  4. Insert Translations for DE, FR, EN
*/

-- Insert categories
INSERT INTO categories (name, slug, description) VALUES
('Natural Soaps', 'natural-soaps', 'Premium handmade natural soaps from the Swiss Alps'),
('Specialty Collection', 'specialty-collection', 'Limited edition and seasonal soap collections'),
('Gift Sets', 'gift-sets', 'Curated soap gift packages perfect for any occasion')
ON CONFLICT (slug) DO NOTHING;

-- Insert products
INSERT INTO products (
  name, slug, category_id, price, stock, featured, 
  skin_types, scents, ingredients
) VALUES
(
  'Alpine Forest',
  'alpine-forest',
  (SELECT id FROM categories WHERE slug = 'natural-soaps'),
  28.00,
  15,
  true,
  ARRAY['all'],
  ARRAY['cedarwood', 'fir', 'moss'],
  ARRAY['olive oil', 'coconut oil', 'palm oil', 'cedarwood essential oil', 'fir essential oil']
),
(
  'Mountain Lavender',
  'mountain-lavender',
  (SELECT id FROM categories WHERE slug = 'natural-soaps'),
  26.00,
  20,
  true,
  ARRAY['sensitive', 'dry'],
  ARRAY['lavender', 'chamomile', 'honey'],
  ARRAY['olive oil', 'coconut oil', 'shea butter', 'lavender essential oil', 'chamomile extract']
),
(
  'Glacier Fresh',
  'glacier-fresh',
  (SELECT id FROM categories WHERE slug = 'natural-soaps'),
  24.00,
  18,
  true,
  ARRAY['oily', 'normal'],
  ARRAY['eucalyptus', 'mint', 'lemon'],
  ARRAY['olive oil', 'coconut oil', 'eucalyptus essential oil', 'peppermint essential oil']
),
(
  'Alpine Meadow Blossoms',
  'alpine-meadow-blossoms',
  (SELECT id FROM categories WHERE slug = 'natural-soaps'),
  30.00,
  12,
  false,
  ARRAY['all'],
  ARRAY['rose', 'geranium', 'wildflower'],
  ARRAY['olive oil', 'coconut oil', 'rose hip oil', 'geranium essential oil']
),
(
  'Smooth Stone',
  'smooth-stone',
  (SELECT id FROM categories WHERE slug = 'specialty-collection'),
  32.00,
  8,
  true,
  ARRAY['sensitive'],
  ARRAY['unscented', 'gentle'],
  ARRAY['olive oil', 'coconut oil', 'avocado oil', 'aloe vera']
),
(
  'Alpine Essence Gift Set',
  'alpine-essence-gift-set',
  (SELECT id FROM categories WHERE slug = 'gift-sets'),
  85.00,
  10,
  true,
  ARRAY['all'],
  ARRAY['assorted'],
  ARRAY['see individual soaps']
)
ON CONFLICT (slug) DO NOTHING;

-- Insert product images
INSERT INTO product_images (product_id, image_url, alt_text, sort_order) VALUES
(
  (SELECT id FROM products WHERE slug = 'alpine-forest'),
  'https://images.pexels.com/photos/3621519/pexels-photo-3621519.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Alpine Forest soap bar with cedarwood and fir scents',
  0
),
(
  (SELECT id FROM products WHERE slug = 'alpine-forest'),
  'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Natural soap texture detail',
  1
),
(
  (SELECT id FROM products WHERE slug = 'mountain-lavender'),
  'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Mountain Lavender soap with chamomile and honey',
  0
),
(
  (SELECT id FROM products WHERE slug = 'mountain-lavender'),
  'https://images.pexels.com/photos/3571551/pexels-photo-3571551.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Lavender soap in natural setting',
  1
),
(
  (SELECT id FROM products WHERE slug = 'glacier-fresh'),
  'https://images.pexels.com/photos/3962289/pexels-photo-3962289.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Glacier Fresh soap with eucalyptus and mint',
  0
),
(
  (SELECT id FROM products WHERE slug = 'glacier-fresh'),
  'https://images.pexels.com/photos/3621517/pexels-photo-3621517.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Fresh mint soap texture',
  1
),
(
  (SELECT id FROM products WHERE slug = 'alpine-meadow-blossoms'),
  'https://images.pexels.com/photos/3807516/pexels-photo-3807516.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Alpine Meadow Blossoms with rose and wildflower',
  0
),
(
  (SELECT id FROM products WHERE slug = 'smooth-stone'),
  'https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Smooth Stone unscented gentle soap',
  0
),
(
  (SELECT id FROM products WHERE slug = 'alpine-essence-gift-set'),
  'https://images.pexels.com/photos/3621520/pexels-photo-3621520.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Alpine Essence Gift Set with assorted soaps',
  0
)
ON CONFLICT DO NOTHING;

-- Insert English translations
INSERT INTO product_translations (product_id, language_code, name, description, how_to_use) VALUES
(
  (SELECT id FROM products WHERE slug = 'alpine-forest'),
  'en',
  'Alpine Forest',
  'Immerse yourself in the crisp, refreshing scents of the Swiss Alps. This soap captures the essence of cedarwood forests with hints of fir and mossy undertones. Perfect for those who love nature-inspired fragrances.',
  'Wet your hands, create a rich lather with the soap, and massage gently over your body. Rinse thoroughly. Perfect for daily use.'
),
(
  (SELECT id FROM products WHERE slug = 'mountain-lavender'),
  'en',
  'Mountain Lavender',
  'Soothe your senses with our bestselling Mountain Lavender soap. Blended with lavender from Alpine meadows, chamomile, and golden honey. Ideal for sensitive and dry skin.',
  'Massage over damp skin in circular motions. The gentle formula is suitable for daily use. Perfect for bedtime relaxation.'
),
(
  (SELECT id FROM products WHERE slug = 'glacier-fresh'),
  'en',
  'Glacier Fresh',
  'Feel the invigorating coolness of glacial spring water combined with eucalyptus, mint, and bright lemon notes. This energizing soap awakens your skin and senses.',
  'Apply to wet skin and lather generously. The refreshing formula works best for morning showers and oily skin types.'
),
(
  (SELECT id FROM products WHERE slug = 'alpine-meadow-blossoms'),
  'en',
  'Alpine Meadow Blossoms',
  'A delicate blend of rose, geranium, and wildflower extracts. Romantic and sophisticated, this soap is perfect for special occasions or treating yourself.',
  'Use daily for a luxurious bathing experience. Rinse thoroughly after application.'
),
(
  (SELECT id FROM products WHERE slug = 'smooth-stone'),
  'en',
  'Smooth Stone',
  'Our gentlest formula, completely unscented and crafted for the most sensitive skin. Enriched with aloe vera and avocado oil for extra nourishment.',
  'Gentle enough for sensitive skin. Use as directed for daily body care.'
),
(
  (SELECT id FROM products WHERE slug = 'alpine-essence-gift-set'),
  'en',
  'Alpine Essence Gift Set',
  'The perfect introduction to Alpine Essence soaps. This curated set includes our three bestsellers: Alpine Forest, Mountain Lavender, and Glacier Fresh, beautifully packaged for gifting.',
  'Includes 3 premium soaps. Use as directed for each product.'
)
ON CONFLICT DO NOTHING;

-- Insert French translations
INSERT INTO product_translations (product_id, language_code, name, description, how_to_use) VALUES
(
  (SELECT id FROM products WHERE slug = 'alpine-forest'),
  'fr',
  'Forêt Alpine',
  'Immergez-vous dans les parfums frais et revigorants des Alpes suisses. Ce savon capture l''essence des forêts de cèdre avec des notes de sapin et de mousse.',
  'Mouillez vos mains, créez une mousse riche et massez doucement. Rincez bien.'
),
(
  (SELECT id FROM products WHERE slug = 'mountain-lavender'),
  'fr',
  'Lavande des Montagnes',
  'Apaisez vos sens avec notre savon Lavande des Montagnes à succès. Mélangé avec de la lavande des prés alpins, de la camomille et du miel.',
  'Massez sur peau humide. Formule douce adaptée à une utilisation quotidienne.'
),
(
  (SELECT id FROM products WHERE slug = 'glacier-fresh'),
  'fr',
  'Fraîcheur Glaciale',
  'Ressentez la fraîcheur revigorante de l''eau glaciale combinée à l''eucalyptus, la menthe et les notes citronnées.',
  'Appliquez sur peau mouillée et moussez généreusement. Rincez bien.'
)
ON CONFLICT DO NOTHING;

-- Insert German translations
INSERT INTO product_translations (product_id, language_code, name, description, how_to_use) VALUES
(
  (SELECT id FROM products WHERE slug = 'alpine-forest'),
  'de',
  'Alpiner Wald',
  'Tauchen Sie ein in die frischen und belebenden Düfte der Schweizer Alpen. Diese Seife erfasst die Essenz von Zedernwäldern mit Anklängen von Fichte und Moos.',
  'Hände anfeuchten, reichlich Schaum erzeugen und sanft massieren. Gründlich ausspülen.'
),
(
  (SELECT id FROM products WHERE slug = 'mountain-lavender'),
  'de',
  'Berg-Lavendel',
  'Entspannen Sie mit unserer bestseller Berg-Lavendel Seife. Gemischt mit Lavendel aus Alpenwiesen, Kamille und goldenem Honig.',
  'Auf feuchter Haut anwenden. Die sanfte Formel eignet sich für die tägliche Verwendung.'
),
(
  (SELECT id FROM products WHERE slug = 'glacier-fresh'),
  'de',
  'Gletscher Frisch',
  'Spüren Sie die belebende Frische des Gletscherwassers kombiniert mit Eukalyptus, Minze und hellen Zitronennoten.',
  'Auf feuchter Haut anwenden und großzügig aufschäumen. Gründlich ausspülen.'
)
ON CONFLICT DO NOTHING;
