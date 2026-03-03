-- ============================================
-- Script SQL pour réinitialiser la base de données Supabase
-- ⚠️ ATTENTION : Ce script supprime TOUTES les tables existantes
-- ============================================

-- Désactiver les contraintes de clés étrangères temporairement
SET session_replication_role = 'replica';

-- Supprimer toutes les tables dans l'ordre inverse des dépendances
DROP TABLE IF EXISTS "promo_code_products" CASCADE;
DROP TABLE IF EXISTS "promo_code_categories" CASCADE;
DROP TABLE IF EXISTS "promo_codes" CASCADE;
DROP TABLE IF EXISTS "order_items" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "reviews" CASCADE;
DROP TABLE IF EXISTS "product_sizes" CASCADE;
DROP TABLE IF EXISTS "product_colors" CASCADE;
DROP TABLE IF EXISTS "product_images" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "addresses" CASCADE;
DROP TABLE IF EXISTS "customers" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "hero_slides" CASCADE;
DROP TABLE IF EXISTS "settings" CASCADE;

-- Réactiver les contraintes
SET session_replication_role = 'origin';

-- Vérifier que toutes les tables sont supprimées
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Si des tables persistent, utilisez cette commande pour tout supprimer :
-- DO $$ 
-- DECLARE 
--     r RECORD;
-- BEGIN
--     FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
--     LOOP
--         EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
--     END LOOP;
-- END $$;
