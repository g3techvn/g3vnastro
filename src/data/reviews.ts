export interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  content: string;
  date: string;
  likes: number;
  verified: boolean;
  hasPhoto?: boolean;
  photos?: string[];
  hasVideo?: boolean;
  videoThumbnail?: string;
  isExpert?: boolean;
  productName: string;
  productSlug: string;
  productImage: string;
  publisherReply?: {
    name: string;
    date: string;
    content: string;
  };
}

export interface RatingSummary {
  average: number;
  total: number;
  stars: Array<{
    star: number;
    count: number;
    percent: number;
  }>;
}

export const allReviews: Review[] = [
  {
    id: '1',
    user: { name: 'Tám Phạm', avatar: '👨‍💼' },
    rating: 5,
    content: 'Ghế công thái học này thực sự rất thoải mái, ngồi làm việc lâu không bị đau lưng. Chất liệu tốt, lắp ráp dễ dàng. Rất đáng tiền!',
    date: '26/4/2025',
    likes: 156,
    verified: true,
    hasPhoto: true,
    photos: ['/images/review-1.jpg', '/images/review-2.jpg'],
    productName: 'Ghế Công Thái Học Herman Miller Aeron',
    productSlug: 'ghe-cong-thai-hoc-herman-miller-aeron',
    productImage: '/images/products/herman-miller-aeron.jpg',
    publisherReply: {
      name: 'G3-TECH',
      date: '26/4/2025',
      content: 'Cảm ơn bạn đã tin tưởng và lựa chọn ghế công thái học của G3-TECH. Chúng tôi rất vui khi sản phẩm giúp bạn làm việc thoải mái hơn!'
    }
  },
  {
    id: '2',
    user: { name: 'Anh Trương', avatar: '👨‍🔧' },
    rating: 4,
    content: 'Ghế ngồi êm, tựa lưng tốt nhưng phần kê tay hơi thấp so với mình. Mong shop có thêm phụ kiện nâng kê tay.',
    date: '11/5/2025',
    likes: 23,
    verified: true,
    hasVideo: true,
    videoThumbnail: '/images/video-thumb-1.jpg',
    productName: 'Ghế Công Thái Học Herman Miller Aeron',
    productSlug: 'ghe-cong-thai-hoc-herman-miller-aeron',
    productImage: '/images/products/herman-miller-aeron.jpg'
  },
  {
    id: '3',
    user: { name: 'Minh Hằng', avatar: '👩‍💻' },
    rating: 5,
    content: 'Mình rất thích thiết kế của ghế, hiện đại và chắc chắn. Giao hàng nhanh, đóng gói cẩn thận. Sẽ giới thiệu cho bạn bè!',
    date: '2/6/2025',
    likes: 41,
    verified: true,
    hasPhoto: true,
    photos: ['/images/review-3.jpg'],
    productName: 'Ghế Công Thái Học Herman Miller Aeron',
    productSlug: 'ghe-cong-thai-hoc-herman-miller-aeron',
    productImage: '/images/products/herman-miller-aeron.jpg'
  },
  {
    id: '4',
    user: { name: 'Dr. Nguyễn Văn A', avatar: '👨‍⚕️' },
    rating: 5,
    content: 'Là bác sĩ chuyên khoa cột sống, tôi khuyên dùng ghế này cho bệnh nhân. Thiết kế ergonomic rất tốt, giúp giảm áp lực lên đốt sống thắt lưng.',
    date: '15/5/2025',
    likes: 89,
    verified: true,
    isExpert: true,
    productName: 'Ghế Công Thái Học Herman Miller Aeron',
    productSlug: 'ghe-cong-thai-hoc-herman-miller-aeron',
    productImage: '/images/products/herman-miller-aeron.jpg'
  },
  {
    id: '5',
    user: { name: 'Lan Nguyễn', avatar: '👩‍💼' },
    rating: 5,
    content: 'Bàn nâng hạ này giúp mình thay đổi tư thế làm việc linh hoạt. Chất lượng tuyệt vời, motor êm, không ồn. Đáng đồng tiền bát gạo!',
    date: '20/5/2025',
    likes: 67,
    verified: true,
    hasPhoto: true,
    photos: ['/images/review-desk-1.jpg', '/images/review-desk-2.jpg'],
    productName: 'Bàn Nâng Hạ Điện Tử FlexiDesk Pro',
    productSlug: 'ban-nang-ha-dien-tu-flexidesk-pro',
    productImage: '/images/products/flexidesk-pro.jpg',
    publisherReply: {
      name: 'G3-TECH',
      date: '21/5/2025',
      content: 'Cảm ơn chị Lan đã chia sẻ trải nghiệm! Chúng tôi rất vui khi sản phẩm giúp chị làm việc hiệu quả hơn. Chúc chị luôn khỏe mạnh!'
    }
  },
  {
    id: '6',
    user: { name: 'Hoàng Minh', avatar: '👨‍💻' },
    rating: 4,
    content: 'Bàn làm việc chắc chắn, thiết kế đẹp. Tuy nhiên hướng dẫn lắp ráp hơi khó hiểu, mất khá nhiều thời gian để hoàn thành.',
    date: '18/5/2025',
    likes: 34,
    verified: true,
    productName: 'Bàn Nâng Hạ Điện Tử FlexiDesk Pro',
    productSlug: 'ban-nang-ha-dien-tu-flexidesk-pro',
    productImage: '/images/products/flexidesk-pro.jpg'
  },
  {
    id: '7',
    user: { name: 'Thu Hà', avatar: '👩‍🎨' },
    rating: 5,
    content: 'Tủ tài liệu này rất tiện lợi, nhiều ngăn để đồ. Khóa an toàn, chất liệu kim loại bền bỉ. Phù hợp cho văn phòng nhỏ như của mình.',
    date: '25/5/2025',
    likes: 28,
    verified: true,
    hasPhoto: true,
    photos: ['/images/review-cabinet-1.jpg'],
    productName: 'Tủ Tài Liệu Thép SecureFile 4 Ngăn',
    productSlug: 'tu-tai-lieu-thep-securefile-4-ngan',
    productImage: '/images/products/securefile-cabinet.jpg'
  },
  {
    id: '8',
    user: { name: 'Đức Anh', avatar: '👨‍🏫' },
    rating: 5,
    content: 'Đèn bàn LED này rất tốt, ánh sáng dịu mắt, không gây mỏi mắt khi làm việc ban đêm. Có thể điều chỉnh độ sáng và màu sắc ánh sáng.',
    date: '22/5/2025',
    likes: 45,
    verified: true,
    hasVideo: true,
    videoThumbnail: '/images/video-lamp-1.jpg',
    productName: 'Đèn Bàn LED Thông Minh LightPro X1',
    productSlug: 'den-ban-led-thong-minh-lightpro-x1',
    productImage: '/images/products/lightpro-x1.jpg'
  },
  {
    id: '9',
    user: { name: 'Mai Phương', avatar: '👩‍⚖️' },
    rating: 4,
    content: 'Kệ sách gỗ đẹp, chắc chắn. Tuy nhiên màu gỗ hơi khác so với hình ảnh trên web, nhưng vẫn ổn. Giao hàng đúng hẹn.',
    date: '19/5/2025',
    likes: 19,
    verified: true,
    productName: 'Kệ Sách Gỗ Tự Nhiên BookShelf Premium',
    productSlug: 'ke-sach-go-tu-nhien-bookshelf-premium',
    productImage: '/images/products/bookshelf-premium.jpg',
    publisherReply: {
      name: 'G3-TECH',
      date: '20/5/2025',
      content: 'Cảm ơn chị Mai đã phản hồi! Về màu sắc gỗ tự nhiên có thể có chút khác biệt do đặc tính vật liệu. Chúng tôi sẽ cải thiện hình ảnh sản phẩm để chính xác hơn.'
    }
  },
  {
    id: '10',
    user: { name: 'Quang Huy', avatar: '👨‍🔬' },
    rating: 5,
    content: 'Ghế gaming này tuyệt vời! Ngồi chơi game 8-10 tiếng không bị mỏi. Tựa đầu và tựa lưng rất thoải mái. Màu sắc đẹp, phù hợp với setup gaming.',
    date: '24/5/2025',
    likes: 78,
    verified: true,
    hasPhoto: true,
    photos: ['/images/review-gaming-1.jpg', '/images/review-gaming-2.jpg'],
    productName: 'Ghế Gaming Pro Racer RGB',
    productSlug: 'ghe-gaming-pro-racer-rgb',
    productImage: '/images/products/pro-racer-rgb.jpg'
  },
  {
    id: '11',
    user: { name: 'Thảo Nguyên', avatar: '👩‍🔬' },
    rating: 5,
    content: 'Bàn họp tròn này rất phù hợp cho phòng meeting nhỏ. Chất liệu gỗ cao cấp, bề mặt nhẵn mịn. Lắp ráp đơn giản, hướng dẫn rõ ràng.',
    date: '21/5/2025',
    likes: 33,
    verified: true,
    productName: 'Bàn Họp Tròn Gỗ Cao Cấp MeetingTable Pro',
    productSlug: 'ban-hop-tron-go-cao-cap-meetingtable-pro',
    productImage: '/images/products/meetingtable-pro.jpg'
  },
  {
    id: '12',
    user: { name: 'Văn Đức', avatar: '👨‍🎯' },
    rating: 4,
    content: 'Tấm lót chuột lớn này rất tốt cho công việc thiết kế. Bề mặt mịn, chuột di chuyển êm. Tuy nhiên hơi mỏng, dễ bị trượt trên bàn.',
    date: '17/5/2025',
    likes: 15,
    verified: true,
    productName: 'Tấm Lót Chuột Lớn DesignPad XXL',
    productSlug: 'tam-lot-chuot-lon-designpad-xxl',
    productImage: '/images/products/designpad-xxl.jpg'
  }
];

export const overallRatingSummary: RatingSummary = {
  average: 4.7,
  total: allReviews.length,
  stars: [
    { star: 5, count: 8, percent: Math.round((8 / allReviews.length) * 100) },
    { star: 4, count: 4, percent: Math.round((4 / allReviews.length) * 100) },
    { star: 3, count: 0, percent: 0 },
    { star: 2, count: 0, percent: 0 },
    { star: 1, count: 0, percent: 0 },
  ]
};

// Helper functions
export const getReviewsByRating = (rating: number) => {
  return allReviews.filter(review => review.rating === rating);
};

export const getReviewsWithPhotos = () => {
  return allReviews.filter(review => review.hasPhoto);
};

export const getReviewsWithVideos = () => {
  return allReviews.filter(review => review.hasVideo);
};

export const getVerifiedReviews = () => {
  return allReviews.filter(review => review.verified);
};

export const getExpertReviews = () => {
  return allReviews.filter(review => review.isExpert);
};

export const getReviewsByProduct = (productSlug: string) => {
  return allReviews.filter(review => review.productSlug === productSlug);
};

export const getRecentReviews = (limit: number = 10) => {
  return allReviews
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};