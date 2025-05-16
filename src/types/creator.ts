
export interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  contentRequirements: Record<string, any>;
  brandId: string;
  platforms: string[];
  dealId: string;
  value: number;
  deadline: string;
  brandName: string;
  brandLogo: string | null;
  uploads: any[];
}
