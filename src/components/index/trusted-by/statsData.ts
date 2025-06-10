
import { Award, TrendingUp, Target, DollarSign, Users, Trophy } from 'lucide-react';

export interface StatCard {
  id: number;
  percentage: string;
  title: string;
  description: string;
  icon: any;
  step: string;
}

export const statsData: StatCard[] = [
  {
    id: 1,
    percentage: "92%",
    title: "Consumer Trust",
    description: "of consumers trust influencer marketing content over traditional ads",
    icon: Users,
    step: "Step 1"
  },
  {
    id: 2,
    percentage: "35%",
    title: "Cost Efficiency", 
    description: "more expensive: traditional paid ads vs creator led content",
    icon: DollarSign,
    step: "Step 2"
  },
  {
    id: 3,
    percentage: "74%",
    title: "Content Performance",
    description: "of brands say creators drive their highest performing content",
    icon: TrendingUp,
    step: "Step 3"
  },
  {
    id: 4,
    percentage: "84.8%",
    title: "Marketing Effectiveness",
    description: "say influencer marketing is effective, not a gamble",
    icon: Target,
    step: "Step 4"
  },
  {
    id: 5,
    percentage: "6.16x",
    title: "ROI Multiplier",
    description: "brands earn $6.16 for every $1 spent on creator campaigns",
    icon: Award,
    step: "Step 5"
  },
  {
    id: 6,
    percentage: "6x",
    title: "Return Investment",
    description: "average return on investment for creator partnerships",
    icon: Trophy,
    step: "Step 6"
  }
];
