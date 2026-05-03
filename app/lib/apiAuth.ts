import { createClient } from "@supabase/supabase-js"

export function getBearerToken(req: Request) {
  const authHeader = req.headers.get("authorization")

  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }

  return authHeader.replace("Bearer ", "").trim()
}

export async function getApiUser(req: Request) {
  const token = getBearerToken(req)

  if (!token) {
    return {
      user: null,
      error: "Missing authorization token",
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      user: null,
      error: "Missing Supabase environment variables",
    }
  }

  const supabaseWithAuth = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

  const { data, error } = await supabaseWithAuth.auth.getUser()

  if (error) {
    return {
      user: null,
      error: error.message,
    }
  }

  return {
    user: data.user,
    error: null,
  }
}