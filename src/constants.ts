export const COMPANY_INFO = {
  name: 'Công Ty Cổ phần Công nghệ G3 Việt Nam',
  shortName: 'G3Tech',
  hotline: '0947776662',
  email: 'info@g-3.vn',
  supportEmail: 'info@g-3.vn',
  address: 'Tầng 7, Tòa nhà Charmvit, số 117 Trần Duy Hưng, Q. Cầu Giấy, TP. Hà Nội.',
  website: 'https://g-3.vn',
  workingHours: '8:00 - 17:30 (Thứ 2 - Thứ 6)',
  supportHours: '8:00 - 22:00 hàng ngày',
  zalo: 'https://zalo.me/0947776662',
  storeLocations: [
    {
      name: 'G3 Tech - Phố Vọng',
      address: 'Số 128 Phố Vọng, Phương Liệt, Thanh Xuân, Hà Nội',
      coordinates: {
        lat: 20.995377,
        lng: 105.84511,
      },
    },
    {
      name: 'G3 Tech - Nguyễn Văn Cừ',
      address: 'Số 4 ngách 12 ngõ 135 Nguyễn Văn Cừ, Ngọc Lâm, Long Biên, Hà Nội',
      coordinates: {
        lat: 21.044876,
        lng: 105.870914,
      },
    },
    {
      name: 'G3 Tech - TP.HCM',
      address: 'Số 1/23 Huỳnh Lan Khanh, Phường 2, Tân Bình, TP.HCM',
      coordinates: {
        lat: 10.79718,
        lng: 106.657372,
      },
    },
  ]
} as const;

export const BANK_INFO = {
  accountName: 'NGUYEN VAN DAT',
  accountNumber: '0190149332332',
  bankName: 'MB Bank',
} as const;

export const SOCIAL_LINKS = [
  { name: 'Shopee', href: 'https://shopee.vn/g3tech' },
  { name: 'Facebook', href: 'https://www.facebook.com/g3.vntech/' },
  { name: 'Tiktok', href: 'https://www.tiktok.com/@g3tech.vn' },
  { name: 'Youtube', href: 'https://www.youtube.com/@g3-tech' },
] as const;

export const SHIPPING_PROVIDERS = [
  { name: "ViettelPost" },
  { name: "GHTK" }
] as const;

export const PAYMENT_METHODS = [
  { name: "Visa" },
  { name: "MasterCard" },
  { name: "JCB" },
  { name: "QR Pay" }
] as const;

export const QUICK_LINKS = [
  { name: "Chính sách G3Tech", href: "/chinh-sach" },
  { name: "Chính sách bảo hành", href: "/chinh-sach#warranty" },
  { name: "Chính sách đổi trả", href: "/chinh-sach#return" },
  { name: "Chính sách vận chuyển", href: "/chinh-sach#shipping" },
  { name: "Chính sách bảo mật", href: "/chinh-sach#privacy" },
  { name: "Chính sách thanh toán", href: "/chinh-sach#payment" },
  { name: "Trợ giúp & Hỗ trợ", href: "/help" },
] as const;

export const FEEDBACK_INFO = {
  heading: "Phản hồi & khiếu nại",
  content: "Phản hồi nóng về chất lượng sản phẩm và dịch vụ. Đội ngũ Kiểm Soát Chất Lượng của chúng tôi sẵn sàng lắng nghe quý khách.",
} as const;

// Help & Support Constants
export const HELP_CONTACT_METHODS = [
  {
    icon: '📞',
    title: 'Hotline',
    // value: '0947776662',
    value: '0947776662',
    description: '8:00 - 22:00 hàng ngày',
    type: 'phone'
  },
  {
    icon: '📧',
    title: 'Email',
    value: 'info@g-3.vn',
    description: 'Phản hồi trong 24h',
    type: 'email'
  },
  {
    icon: '📍',
    title: 'Showroom',
    value: '3 cửa hàng',
    description: 'HN & HCM - Xem địa chỉ',
    type: 'location'
  }
] as const; export const FAQ_CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: '📋' },
  { id: 'product', name: 'Sản phẩm', icon: '🪑' },
  { id: 'order', name: 'Đặt hàng', icon: '🛒' },
  { id: 'warranty', name: 'Bảo hành', icon: '🛡️' },
  { id: 'delivery', name: 'Giao hàng', icon: '🚚' }
] as const;

export const FAQ_DATA = [
  {
    id: 1,
    question: 'Làm thế nào để chọn ghế công thái học phù hợp?',
    answer: 'Để chọn ghế phù hợp, bạn cần xem xét: chiều cao cơ thể, thói quen làm việc, không gian văn phòng và ngân sách. Chúng tôi có bộ lọc thông minh giúp bạn tìm ghế phù hợp nhất.',
    category: 'product'
  },
  {
    id: 2,
    question: 'Ghế có bảo hành bao lâu?',
    answer: 'Tất cả ghế công thái học đều có bảo hành từ 2-5 năm tùy theo thương hiệu và model. Bảo hành bao gồm lỗi kỹ thuật, hư hỏng do sản xuất.',
    category: 'warranty'
  },
  {
    id: 3,
    question: 'Tôi có thể đổi trả sản phẩm không?',
    answer: 'Bạn có thể đổi trả trong vòng 7 ngày kể từ khi nhận hàng nếu sản phẩm còn nguyên vẹn, chưa sử dụng và có đầy đủ phụ kiện.',
    category: 'order'
  },
  {
    id: 4,
    question: 'Thời gian giao hàng là bao lâu?',
    answer: 'Thời gian giao hàng: Nội thành HN/HCM 1-2 ngày, các tỉnh thành khác 3-5 ngày làm việc. Chúng tôi có dịch vụ giao hàng nhanh trong ngày.',
    category: 'delivery'
  },
  {
    id: 5,
    question: 'Có dịch vụ lắp đặt tại nhà không?',
    answer: 'Có, chúng tôi cung cấp dịch vụ lắp đặt miễn phí tại nhà trong nội thành HN/HCM. Các khu vực khác có phí dịch vụ hợp lý.',
    category: 'delivery'
  },
  {
    id: 6,
    question: 'Tôi có thể xem ghế trực tiếp không?',
    answer: 'Bạn có thể đến showroom của chúng tôi để trải nghiệm trực tiếp. Chúng tôi có 3 cửa hàng tại Hà Nội và TP.HCM. Xem chi tiết địa chỉ trong mục "Showroom" hoặc gọi hotline 0947776662.',
    category: 'product'
  },
  {
    id: 7,
    question: 'Có hỗ trợ trả góp không?',
    answer: 'Có, chúng tôi hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng và các công ty tài chính uy tín như Home Credit, FE Credit.',
    category: 'order'
  },
  {
    id: 8,
    question: 'Làm sao để bảo quản ghế đúng cách?',
    answer: 'Vệ sinh định kỳ bằng khăn ẩm, tránh ánh nắng trực tiếp, kiểm tra và vặn chặt ốc vít 3-6 tháng/lần, sử dụng đúng trọng lượng cho phép.',
    category: 'product'
  }
] as const;

export const HELP_RESOURCES = [
  {
    icon: '📖',
    title: 'Hướng dẫn chọn ghế',
    description: 'Cách chọn ghế phù hợp với cơ thể',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    link: '/guide/chair-selection'
  },
  {
    icon: '🔧',
    title: 'Hướng dẫn lắp đặt',
    description: 'Video và tài liệu lắp đặt chi tiết',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    link: '/guide/installation'
  },
  {
    icon: '💡',
    title: 'Mẹo sử dụng',
    description: 'Cách bảo quản và sử dụng hiệu quả',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    link: '/guide/tips'
  },
  {
    icon: '🛡️',
    title: 'Chính sách bảo hành',
    description: 'Thông tin chi tiết về bảo hành',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    link: '/chinh-sach#warranty'
  }
] as const;

export const CHAIR_SELECTION_GUIDE = {
  steps: [
    {
      title: 'Đo chiều cao cơ thể',
      description: 'Chiều cao quyết định độ cao ghế và tựa lưng phù hợp',
      icon: '📏',
      details: [
        'Dưới 1m60: Chọn ghế có độ cao 38-42cm',
        '1m60-1m75: Chọn ghế có độ cao 42-46cm',
        'Trên 1m75: Chọn ghế có độ cao 46-50cm'
      ]
    },
    {
      title: 'Xác định thời gian sử dụng',
      description: 'Thời gian ngồi quyết định mức độ hỗ trợ cần thiết',
      icon: '⏰',
      details: [
        'Dưới 4h/ngày: Ghế cơ bản, tựa lưng đơn giản',
        '4-8h/ngày: Ghế có đệm êm, tựa lưng ergonomic',
        'Trên 8h/ngày: Ghế cao cấp, đầy đủ tính năng'
      ]
    },
    {
      title: 'Chọn tính năng phù hợp',
      description: 'Các tính năng hỗ trợ dựa trên nhu cầu cụ thể',
      icon: '⚙️',
      details: [
        'Tựa đầu: Cần thiết nếu làm việc lâu',
        'Tựa tay: Giảm mỏi vai, cổ',
        'Massage: Thư giãn sau giờ làm việc'
      ]
    },
    {
      title: 'Xem xét ngân sách',
      description: 'Cân bằng giữa chất lượng và giá cả',
      icon: '💰',
      details: [
        'Dưới 3 triệu: Ghế cơ bản, chất lượng tốt',
        '3-7 triệu: Ghế trung cấp, nhiều tính năng',
        'Trên 7 triệu: Ghế cao cấp, công nghệ hiện đại'
      ]
    }
  ]
} as const;

export const WARRANTY_INFO = {
  general: {
    period: '2-5 năm tùy theo sản phẩm',
    coverage: 'Lỗi kỹ thuật, hư hỏng do sản xuất',
    exclusions: 'Hư hỏng do sử dụng sai cách, va đập mạnh'
  },
  process: [
    'Liên hệ hotline báo lỗi',
    'Cung cấp thông tin sản phẩm và lỗi',
    'Kỹ thuật viên kiểm tra và xử lý',
    'Sửa chữa hoặc thay thế miễn phí'
  ]
} as const;