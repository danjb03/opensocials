
export interface Deal {
  id: string;
  title: string;
  value: number;
  status: string;
  creator_name: string;
  brand_name: string;
  created_at: string;
}

export interface Campaign {
  title: string;
  deals: Deal[];
  brand_name: string;
  created_at: string;
  status: string;
}
