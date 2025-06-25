
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { supabase } from '@/integrations/supabase/client'
import { getUserRole, updateUserMetadata } from '@/utils/getUserRole'
import type { UserRole } from '@/lib/auth'

interface CreatorProfile {
  user_id: string
  first_name: string | null
  last_name: string | null
  username: string | null
  bio: string | null
  avatar_url: string | null
  banner_url: string | null
  primary_platform: string | null
  content_types: string[] | null
  platforms: string[] | null
  industries: string[] | null
  social_handles: any
  audience_location: any
  visibility_settings: any
  is_profile_complete?: boolean
  follower_count?: number
  engagement_rate?: number
  creator_type?: string
}

interface BrandProfile {
  user_id: string
  company_name: string
  logo_url: string | null
  website_url: string | null
  industry: string | null
  budget_range: string | null
  brand_bio: string | null
  brand_goal: string | null
  campaign_focus: string[] | null
  is_complete?: boolean
}

interface AuthContextProps {
  user: any
  session: any
  emailConfirmed: boolean
  role: UserRole | null
  creatorProfile: CreatorProfile | null
  brandProfile: BrandProfile | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextProps | null>(null)

export const UnifiedAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [emailConfirmed, setEmailConfirmed] = useState(false)
  const [role, setRole] = useState<UserRole | null>(null)
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(
    null
  )
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setSession(session)
      setUser(session?.user ?? null)
      setEmailConfirmed(session?.user?.email_confirmed_at ? true : false)

      if (!session?.user) {
        setIsLoading(false)
        return
      }

      const userId = session.user.id

      let userRole = await getUserRole(userId)

      if (!userRole && userId === 'af6ad2ce-be6c-4620-a440-867c52d66918') {
        userRole = 'super_admin'
        await updateUserMetadata(userId, 'super_admin')
      }

      setRole(userRole)

      if (userRole === 'creator') {
        const { data, error } = await supabase
          .from('creator_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle()
        if (!error && data) setCreatorProfile(data)
      }

      if (userRole === 'brand') {
        const { data, error } = await supabase
          .from('brand_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle()
        if (!error && data) setBrandProfile(data)
      }

      setIsLoading(false)
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setEmailConfirmed(session?.user?.email_confirmed_at ? true : false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        emailConfirmed,
        role,
        creatorProfile,
        brandProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useUnifiedAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useUnifiedAuth must be used within provider')
  return ctx
}

export const useCreatorAuth = () => {
  const { user, creatorProfile, isLoading, role } = useUnifiedAuth()
  return { user, profile: creatorProfile, isLoading, role }
}

export const useBrandAuth = () => {
  const { user, brandProfile, isLoading, role } = useUnifiedAuth()
  return { user, profile: brandProfile, isLoading, role }
}

export const useAdminAuth = () => {
  const { user, isLoading, role } = useUnifiedAuth()
  return { user, profile: user, isLoading, role }
}

export const useAgencyAuth = () => {
  const { user, isLoading, role } = useUnifiedAuth()
  return { user, profile: user, isLoading, role }
}
