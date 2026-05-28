-- Extend briefs SELECT policy so a creator who was invited to a brief can
-- still read it after the brand closes the brief (so they can see what they
-- accepted later). Brand owners still see all their own briefs; status='open'
-- briefs are visible to any authenticated user.

drop policy briefs_select_open_or_own on public.briefs;

create policy briefs_select_open_own_or_invited on public.briefs
  for select to authenticated
  using (
    status = 'open'
    or brand_id = (select auth.uid())
    or exists (
      select 1 from public.brief_invitations bi
      where bi.brief_id = briefs.id and bi.creator_id = (select auth.uid())
    )
  );
