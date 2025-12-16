-- 1. Activer l'extension pour gérer les accents
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- 2. Ajouter la colonne slug
ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug text;

-- 3. Fonction utilitaire pour générer le slug proprement
CREATE OR REPLACE FUNCTION slugify(value text)
RETURNS text AS $$
BEGIN
  -- 1. unaccent() enlève les accents
  -- 2. lower() met en minuscule
  -- 3. regexp_replace remplace tout ce qui n'est pas a-z, 0-9 par des tirets
  -- 4. trim() enlève les tirets au début et à la fin
  RETURN lower(
    trim(
      both '-' FROM regexp_replace(
        regexp_replace(
          unaccent(value),
          '[^a-zA-Z0-9]+', '-', 'g'
        ),
        '-+', '-', 'g'
      )
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. Mettre à jour les articles existants qui n'ont pas de slug
UPDATE articles
SET slug = slugify(title)
WHERE slug IS NULL;

-- 5. Ajouter les contraintes (Unique et Not Null)
-- NOTE : Si vous avez des titres en doublon, l'étape 4 pourrait échouer sur l'unicité.
ALTER TABLE articles
  ALTER COLUMN slug SET NOT NULL,
  ADD CONSTRAINT articles_slug_key UNIQUE (slug);

-- 6. Créer un Trigger pour générer le slug automatiquement à l'insertion/mise à jour
CREATE OR REPLACE FUNCTION public.handle_article_slug()
RETURNS trigger AS $$
BEGIN
  -- Si le slug n'est pas fourni ou vide, on le génère depuis le titre
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := slugify(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_article_slug_change ON articles;

CREATE TRIGGER on_article_slug_change
  BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_article_slug();
