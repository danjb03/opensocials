
import { Creator } from '@/types/creator';

export const mockCreators: Creator[] = [
  {
    id: "1",
    name: "Sophie Evans",
    platform: "Instagram",
    audience: "Gen Z",
    contentType: "Short Form Video",
    followers: "125K",
    engagement: "5.2%",
    priceRange: "$500 - $2,000",
    skills: ["Content Creation", "Photography", "Brand Partnerships"],
    imageUrl: "/placeholder.svg",
    bannerImageUrl: undefined,
    about: "Sophie is a lifestyle content creator who specializes in authentic storytelling and brand partnerships. Her content resonates with young adults looking for genuine recommendations.",
    socialLinks: {
      instagram: "https://instagram.com/sophieevans",
      tiktok: "https://tiktok.com/@sophieevans"
    },
    metrics: {
      followerCount: "125K",
      engagementRate: "5.2%",
      avgViews: "45K",
      avgLikes: "6.5K",
      growthTrend: "+12%"
    },
    audienceLocation: {
      primary: "Global",
      secondary: ["United States", "Canada"],
      countries: [
        { name: "United States", percentage: 45 },
        { name: "Canada", percentage: 25 },
        { name: "United Kingdom", percentage: 15 },
        { name: "Australia", percentage: 15 }
      ]
    },
    industries: ["Lifestyle", "Fashion", "Beauty"]
  },
  {
    id: "2",
    name: "Marcus Chen",
    platform: "TikTok",
    audience: "Gen Z",
    contentType: "Short Form Video",
    followers: "89K",
    engagement: "7.8%",
    priceRange: "$300 - $1,500",
    skills: ["Video Editing", "Trending Content", "Comedy"],
    imageUrl: "/placeholder.svg",
    about: "Marcus creates viral content that blends humor with tech reviews. His authentic approach to product testing has built a loyal following.",
    socialLinks: {
      tiktok: "https://tiktok.com/@marcuschen",
      instagram: "https://instagram.com/marcuschen"
    },
    metrics: {
      followerCount: "89K",
      engagementRate: "7.8%",
      avgViews: "120K",
      avgLikes: "9.3K"
    },
    audienceLocation: {
      primary: "United States"
    },
    industries: ["Technology", "Entertainment"]
  },
  {
    id: "3",
    name: "Isabella Rodriguez",
    platform: "YouTube",
    audience: "Millennials",
    contentType: "Long Form Video",
    followers: "340K",
    engagement: "3.1%",
    priceRange: "$1,000 - $5,000",
    skills: ["Video Production", "Tutorials", "Product Reviews"],
    imageUrl: "/placeholder.svg",
    about: "Isabella produces in-depth tutorials and product reviews, catering to a millennial audience seeking expert advice.",
    socialLinks: {
      youtube: "https://youtube.com/isabellarodriguez",
      twitter: "https://twitter.com/isabellarodriguez"
    },
    metrics: {
      followerCount: "340K",
      engagementRate: "3.1%",
      avgViews: "85K",
      avgLikes: "2.6K"
    },
    audienceLocation: {
      primary: "Canada"
    },
    industries: ["Education", "DIY", "Home Improvement"]
  },
  {
    id: "4",
    name: "Alex Nguyen",
    platform: "Twitter",
    audience: "Gen X",
    contentType: "Text & Media",
    followers: "67K",
    engagement: "4.5%",
    priceRange: "$200 - $800",
    skills: ["Writing", "Social Commentary", "News Analysis"],
    imageUrl: "/placeholder.svg",
    about: "Alex provides insightful commentary on current events and social issues, engaging a Gen X audience with thought-provoking content.",
    socialLinks: {
      twitter: "https://twitter.com/alexnguyen",
      facebook: "https://facebook.com/alexnguyen"
    },
    metrics: {
      followerCount: "67K",
      engagementRate: "4.5%",
      avgViews: "N/A",
      avgLikes: "1.8K"
    },
    audienceLocation: {
      primary: "United Kingdom"
    },
    industries: ["News", "Politics", "Culture"]
  },
  {
    id: "5",
    name: "Emily Carter",
    platform: "Facebook",
    audience: "Boomers",
    contentType: "Images & Articles",
    followers: "210K",
    engagement: "2.8%",
    priceRange: "$400 - $1,200",
    skills: ["Community Engagement", "Event Promotion", "Family Content"],
    imageUrl: "/placeholder.svg",
    about: "Emily connects with a boomer audience through family-oriented content and community event promotions, fostering a close-knit online presence.",
    socialLinks: {
      facebook: "https://facebook.com/emilycarter",
      instagram: "https://instagram.com/emilycarter"
    },
    metrics: {
      followerCount: "210K",
      engagementRate: "2.8%",
      avgViews: "N/A",
      avgLikes: "5.9K"
    },
    audienceLocation: {
      primary: "Australia"
    },
    industries: ["Family", "Lifestyle", "Community"]
  },
  {
    id: "6",
    name: "Jordan Lee",
    platform: "Instagram",
    audience: "Gen Z",
    contentType: "Images & Reels",
    followers: "180K",
    engagement: "6.1%",
    priceRange: "$600 - $2,500",
    skills: ["Fashion", "Travel", "Aesthetics"],
    imageUrl: "/placeholder.svg",
    about: "Jordan curates visually stunning content around fashion and travel, inspiring a Gen Z audience with aspirational aesthetics.",
    socialLinks: {
      instagram: "https://instagram.com/jordanlee",
      tiktok: "https://tiktok.com/@jordanlee"
    },
    metrics: {
      followerCount: "180K",
      engagementRate: "6.1%",
      avgViews: "55K",
      avgLikes: "11K"
    },
    audienceLocation: {
      primary: "Global"
    },
    industries: ["Fashion", "Travel", "Luxury"]
  },
  {
    id: "7",
    name: "Casey Green",
    platform: "TikTok",
    audience: "Millennials",
    contentType: "Comedy & Skits",
    followers: "95K",
    engagement: "8.5%",
    priceRange: "$350 - $1,600",
    skills: ["Comedy", "Acting", "Storytelling"],
    imageUrl: "/placeholder.svg",
    about: "Casey creates humorous skits and comedic content, entertaining a millennial audience with relatable and engaging stories.",
    socialLinks: {
      tiktok: "https://tiktok.com/@caseygreen",
      youtube: "https://youtube.com/caseygreen"
    },
    metrics: {
      followerCount: "95K",
      engagementRate: "8.5%",
      avgViews: "130K",
      avgLikes: "10.2K"
    },
    audienceLocation: {
      primary: "United States"
    },
    industries: ["Entertainment", "Comedy", "Lifestyle"]
  },
  {
    id: "8",
    name: "Jamie White",
    platform: "YouTube",
    audience: "Gen X",
    contentType: "DIY & Tutorials",
    followers: "270K",
    engagement: "3.5%",
    priceRange: "$900 - $4,000",
    skills: ["DIY", "Crafting", "Home Improvement"],
    imageUrl: "/placeholder.svg",
    about: "Jamie shares detailed DIY tutorials and crafting projects, appealing to a Gen X audience interested in hands-on activities.",
    socialLinks: {
      youtube: "https://youtube.com/jamiewhite",
      instagram: "https://instagram.com/jamiewhite"
    },
    metrics: {
      followerCount: "270K",
      engagementRate: "3.5%",
      avgViews: "70K",
      avgLikes: "2.5K"
    },
    audienceLocation: {
      primary: "Canada"
    },
    industries: ["DIY", "Home Improvement", "Crafts"]
  },
  {
    id: "9",
    name: "Avery Brown",
    platform: "Twitter",
    audience: "Boomers",
    contentType: "News & Politics",
    followers: "110K",
    engagement: "5.0%",
    priceRange: "$300 - $1,000",
    skills: ["Journalism", "Politics", "Current Events"],
    imageUrl: "/placeholder.svg",
    about: "Avery delivers concise news updates and political analysis, informing a boomer audience with reliable and timely information.",
    socialLinks: {
      twitter: "https://twitter.com/averybrown",
      facebook: "https://facebook.com/averybrown"
    },
    metrics: {
      followerCount: "110K",
      engagementRate: "5.0%",
      avgViews: "N/A",
      avgLikes: "3.2K"
    },
    audienceLocation: {
      primary: "United Kingdom"
    },
    industries: ["News", "Politics", "Finance"]
  },
  {
    id: "10",
    name: "Riley Davis",
    platform: "Facebook",
    audience: "Gen Z",
    contentType: "Gaming & Esports",
    followers: "150K",
    engagement: "7.2%",
    priceRange: "$500 - $2,000",
    skills: ["Gaming", "Esports", "Streaming"],
    imageUrl: "/placeholder.svg",
    about: "Riley streams live gaming sessions and esports tournaments, engaging a Gen Z audience passionate about competitive gaming.",
    socialLinks: {
      facebook: "https://facebook.com/rileydavis"
    },
    metrics: {
      followerCount: "150K",
      engagementRate: "7.2%",
      avgViews: "N/A",
      avgLikes: "4.8K"
    },
    audienceLocation: {
      primary: "Australia"
    },
    industries: ["Gaming", "Esports", "Technology"]
  }
];
