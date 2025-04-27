
export type UserRequest = {
  id: string;
  user_id: string;
  role: 'creator' | 'brand' | 'admin' | 'super_admin';
  status: 'pending' | 'approved' | 'declined';
  created_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
};
