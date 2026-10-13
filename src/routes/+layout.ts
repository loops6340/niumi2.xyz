import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import type { LayoutLoad } from './$types'
import { createClient } from '@supabase/supabase-js'

export const ssr = false

export const load: LayoutLoad = async ({ fetch, depends }) => {
  depends('supabase:auth')

  const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    global: {
      fetch,
    },
  })


  const { data } = await supabase.auth.getUser()

  const { data: profile }  = await supabase.from("profiles").select().eq("id", data.user?.id)

  const { data: claimsData, error } = await supabase.auth.getClaims()
  const claims = error ? null : claimsData?.claims
  return { supabase, claims, user: profile?.[0] }
}