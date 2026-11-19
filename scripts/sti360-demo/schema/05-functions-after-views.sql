-- Functions whose signature uses a view's row type, so they come after the views.
CREATE OR REPLACE FUNCTION public.temp_account_match_candidates(p_email text DEFAULT ''::text, p_phone10 text DEFAULT ''::text, p_words text[] DEFAULT '{}'::text[])
 RETURNS SETOF temp_accounts_v
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select v.*
  from temp_accounts_v v
  where v.status in ('active', 'used')
    and (
         (coalesce(p_email, '') <> '' and lower(trim(v.email)) = p_email)
      or (coalesce(p_phone10, '') <> ''
          and right(regexp_replace(coalesce(v.phone, ''), '\D', '', 'g'), 10) = p_phone10)
      or exists (
           select 1 from unnest(coalesce(p_words, '{}')) w
           where w <> ''
             and translate(lower(concat_ws(' ', v.first_name, v.last_name, v.student_name)),
                           'áàâäãåéèêëíìîïóòôöõúùûüñç', 'aaaaaaeeeeiiiiooooouuuunc')
                 like '%' || w || '%'
         )
    )
  order by v.created_at desc, v.id;
$function$
;
