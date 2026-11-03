-- Migration: auto_confirm_email
-- Désactivation de la confirmation d'email obligatoire :
-- Confirme automatiquement tout utilisateur créé ou mis à jour dans auth.users.

CREATE OR REPLACE FUNCTION public.handle_auto_confirm_email()
RETURNS trigger AS $$
BEGIN
  NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_auto_confirm_email ON auth.users;

CREATE TRIGGER tr_auto_confirm_email
BEFORE INSERT OR UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_auto_confirm_email();

-- Confirmer rétroactivement tous les comptes existants
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
