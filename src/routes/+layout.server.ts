import type { LayoutServerLoad } from './$types'
export const load: LayoutServerLoad = async ({ cookies, locals }) => {

  const { data: result } = await locals.supabase.auth.getUser()
  
  const user = result || null

  return {
    user: user.user,
    cookies: cookies.getAll(),
  }
}