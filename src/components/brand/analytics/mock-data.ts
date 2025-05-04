
// Mock data for demonstration - this would be replaced by real data from API
export const engagementData = [
  { name: 'Day 1', likes: 400, comments: 240, shares: 100 },
  { name: 'Day 2', likes: 300, comments: 139, shares: 80 },
  { name: 'Day 3', likes: 200, comments: 980, shares: 200 },
  { name: 'Day 4', likes: 278, comments: 390, shares: 150 },
  { name: 'Day 5', likes: 189, comments: 480, shares: 120 },
  { name: 'Day 6', likes: 239, comments: 380, shares: 110 },
  { name: 'Day 7', likes: 349, comments: 430, shares: 190 },
];

export const reachData = [
  { name: 'Day 1', reach: 1400, impressions: 2400 },
  { name: 'Day 2', reach: 1300, impressions: 1398 },
  { name: 'Day 3', reach: 2000, impressions: 9800 },
  { name: 'Day 4', reach: 2780, impressions: 3908 },
  { name: 'Day 5', reach: 1890, impressions: 4800 },
  { name: 'Day 6', reach: 2390, impressions: 3800 },
  { name: 'Day 7', reach: 3490, impressions: 4300 },
];

export const audienceData = [
  { name: 'Age 18-24', value: 30, color: '#9b87f5' },
  { name: 'Age 25-34', value: 40, color: '#D946EF' },
  { name: 'Age 35-44', value: 15, color: '#8B5CF6' },
  { name: 'Age 45+', value: 15, color: '#6E59A5' },
];

export const platformData = [
  { name: 'Instagram', posts: 4, engagement: 4000 },
  { name: 'TikTok', posts: 3, engagement: 3000 },
  { name: 'YouTube', posts: 2, engagement: 2000 },
  { name: 'Twitter', posts: 3, engagement: 1500 },
];

// Mock creator data
export const mockCreators = [
  {
    id: '1',
    name: 'Emma Johnson',
    handle: '@emmacreates',
    platform: 'Instagram',
    performance: 'high',
    engagement: '5.2%',
    reach: '87,500',
    posts: 4,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: '2',
    name: 'Alex Chen',
    handle: '@alexlifestyle',
    platform: 'TikTok',
    performance: 'medium',
    engagement: '4.7%',
    reach: '120,300',
    posts: 3,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: '3',
    name: 'Maya Patel',
    handle: '@mayavibes',
    platform: 'YouTube',
    performance: 'high',
    engagement: '6.1%',
    reach: '45,800',
    posts: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80'
  }
];

export const getPerformanceBadge = (performance: string) => {
  const styles = {
    high: "bg-green-100 text-green-800 hover:bg-green-200",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    low: "bg-red-100 text-red-800 hover:bg-red-200"
  };
  
  return styles[performance as keyof typeof styles] || "bg-gray-100 text-gray-800";
};
