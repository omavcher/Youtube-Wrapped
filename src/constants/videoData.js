import { getCurrentYear } from '../utils/helpers';

const getCurrentYear = () => new Date().getFullYear();

export const channelData = {
  name: "Swagger Sharma",
  profilePhoto: "https://yt3.ggpht.com/ytc/AIdro_lHU8AgFmP3-8Mh-Q_b5tUQJNQ2yPdcAMYSyoOYZkQVR_A=s800-c-k-c0x00ffffff-no-rj",
  subscribers: "7.6M",
  totalViews: "1.1B",
  totalVideos: "157",
  joinDate: "2020-01-01",
  description: "Engineer who didn't get a job at google\nIs now making money by google Adsense😂\n\nContent dekho :\nNetflix aur prime vale maze free mai loo YOUTUBE pe  !",
  topCategories: ["Entertainment"],
  monthlyViews: "5000",
  averageWatchTime: "8:30",
  engagementRate: "4.5%"
};

export const videoData = [
  {
    id: 1,
    title: "Sharma ji ki Shadi || Ep3",
    views: "9.2M",
    likes: "332.1K",
    comments: "16.6K",
    thumbnail: "https://i.ytimg.com/vi/BEt8kcA7cX8/hqdefault.jpg",
    publishDate: "2025-01-26T11:37:48Z",
    duration: "15:30",
    category: "Entertainment",
    tags: ["Entertainment", "Web Series", "Comedy"],
    watchTime: "12:30",
    engagement: "8.5%"
  },
  {
    id: 2,
    title: "Sharma Ji ki Shadi Webseries",
    views: "8.5M",
    likes: "300K",
    comments: "15K",
    thumbnail: "https://i.ytimg.com/vi/nyUffTW9jj8/hqdefault.jpg",
    publishDate: "2025-01-20",
    duration: "20:15",
    category: "Entertainment",
    tags: ["Web Series", "Comedy", "Entertainment"],
    watchTime: "15:45",
    engagement: "7.2%"
  },
  {
    id: 3,
    title: "Lucky Guy || Swagger Sharma",
    views: "7.8M",
    likes: "280K",
    comments: "12K",
    thumbnail: "https://i.ytimg.com/vi/flP5TCjycmo/hqdefault.jpg",
    publishDate: "2025-01-15",
    duration: "25:00",
    category: "Entertainment",
    tags: ["Comedy", "Entertainment"],
    watchTime: "18:20",
    engagement: "6.8%"
  }
];

export const yearlyStats = {
  totalViews: "1.1B",
  totalLikes: "50M",
  totalComments: "2M",
  averageWatchTime: "15:30",
  topPerformingMonth: `January ${currentYear}`,
  mostEngagedVideo: "Sharma ji ki Shadi || Ep3",
  subscriberGrowth: "+50%",
  viewGrowth: "+75%",
  engagementGrowth: "+25%",
  topCategories: [
    { name: "Entertainment", percentage: 100 }
  ],
  monthlyStats: [
    { month: "January", views: 1200000, subscribers: 100000 },
    { month: "February", views: 1500000, subscribers: 150000 },
    { month: "March", views: 2000000, subscribers: 200000 },
    { month: "April", views: 1800000, subscribers: 180000 },
    { month: "May", views: 2200000, subscribers: 220000 }
  ]
}; 