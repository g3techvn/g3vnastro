export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  client: string;
  location: string;
  completedDate: string;
  area: string;
  budget: string;
  images: {
    thumbnail: string;
    gallery: string[];
  };
  tags: string[];
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planning';
  services: string[];
}

export const projectCategories = [
  { id: 'all', name: 'Tất cả', slug: 'all' },
  { id: 'office', name: 'Văn phòng', slug: 'van-phong' },
  { id: 'coworking', name: 'Coworking Space', slug: 'coworking-space' },
  { id: 'corporate', name: 'Doanh nghiệp', slug: 'doanh-nghiep' },
  { id: 'startup', name: 'Startup', slug: 'startup' },
  { id: 'government', name: 'Cơ quan nhà nước', slug: 'co-quan-nha-nuoc' },
  { id: 'education', name: 'Giáo dục', slug: 'giao-duc' }
];

export const projects: Project[] = [
  {
    id: 'techcombank-tower',
    title: 'Techcombank Tower - Không gian làm việc hiện đại',
    description: 'Dự án thiết kế và thi công nội thất văn phòng cho Techcombank Tower với diện tích 2,500m². Không gian được thiết kế theo phong cách hiện đại, tối ưu hóa năng suất làm việc với các giải pháp nội thất thông minh và công thái học.',
    shortDescription: 'Thiết kế văn phòng hiện đại cho Techcombank với diện tích 2,500m²',
    category: 'corporate',
    client: 'Techcombank',
    location: 'Hà Nội',
    completedDate: '2024-03-15',
    area: '2,500m²',
    budget: '15-20 tỷ VNĐ',
    images: {
      thumbnail: 'https://cdn.g-3.vn/projects/techcombank/thumbnail.jpg',
      gallery: [
        'https://cdn.g-3.vn/projects/techcombank/gallery-1.jpg',
        'https://cdn.g-3.vn/projects/techcombank/gallery-2.jpg',
        'https://cdn.g-3.vn/projects/techcombank/gallery-3.jpg',
        'https://cdn.g-3.vn/projects/techcombank/gallery-4.jpg',
        'https://cdn.g-3.vn/projects/techcombank/gallery-5.jpg'
      ]
    },
    tags: ['Văn phòng', 'Hiện đại', 'Công thái học', 'Thông minh'],
    featured: true,
    status: 'completed',
    services: ['Thiết kế nội thất', 'Thi công', 'Cung cấp nội thất', 'Bảo trì']
  },
  {
    id: 'fpt-software-campus',
    title: 'FPT Software Campus - Không gian sáng tạo',
    description: 'Dự án tạo ra không gian làm việc sáng tạo và linh hoạt cho FPT Software với diện tích 3,200m². Thiết kế tập trung vào việc khuyến khích sự hợp tác và đổi mới sáng tạo thông qua các khu vực làm việc đa dạng.',
    shortDescription: 'Không gian làm việc sáng tạo cho FPT Software 3,200m²',
    category: 'office',
    client: 'FPT Software',
    location: 'TP. Hồ Chí Minh',
    completedDate: '2024-01-20',
    area: '3,200m²',
    budget: '20-25 tỷ VNĐ',
    images: {
      thumbnail: 'https://cdn.g-3.vn/projects/fpt/thumbnail.jpg',
      gallery: [
        'https://cdn.g-3.vn/projects/fpt/gallery-1.jpg',
        'https://cdn.g-3.vn/projects/fpt/gallery-2.jpg',
        'https://cdn.g-3.vn/projects/fpt/gallery-3.jpg',
        'https://cdn.g-3.vn/projects/fpt/gallery-4.jpg'
      ]
    },
    tags: ['Sáng tạo', 'Linh hoạt', 'Công nghệ', 'Hợp tác'],
    featured: true,
    status: 'completed',
    services: ['Thiết kế nội thất', 'Thi công', 'Cung cấp nội thất']
  },
  {
    id: 'vingroup-headquarters',
    title: 'Vingroup Headquarters - Đẳng cấp doanh nghiệp',
    description: 'Dự án thiết kế trụ sở chính của Vingroup với diện tích 4,000m². Không gian thể hiện đẳng cấp và uy tín của tập đoàn thông qua thiết kế sang trọng và hiện đại.',
    shortDescription: 'Trụ sở chính Vingroup với thiết kế đẳng cấp 4,000m²',
    category: 'corporate',
    client: 'Vingroup',
    location: 'Hà Nội',
    completedDate: '2023-11-30',
    area: '4,000m²',
    budget: '30-35 tỷ VNĐ',
    images: {
      thumbnail: 'https://cdn.g-3.vn/projects/vingroup/thumbnail.jpg',
      gallery: [
        'https://cdn.g-3.vn/projects/vingroup/gallery-1.jpg',
        'https://cdn.g-3.vn/projects/vingroup/gallery-2.jpg',
        'https://cdn.g-3.vn/projects/vingroup/gallery-3.jpg'
      ]
    },
    tags: ['Sang trọng', 'Đẳng cấp', 'Doanh nghiệp', 'Hiện đại'],
    featured: true,
    status: 'completed',
    services: ['Thiết kế nội thất', 'Thi công', 'Cung cấp nội thất', 'Bảo trì']
  },
  {
    id: 'tokyotech-lab-coworking',
    title: 'TokyoTech Lab - Coworking Space Sáng Tạo',
    description: 'Không gian coworking hiện đại dành cho các startup và freelancer với diện tích 800m². Thiết kế linh hoạt, có thể thay đổi cấu hình theo nhu cầu sử dụng.',
    shortDescription: 'Coworking space hiện đại cho startup và freelancer 800m²',
    category: 'coworking',
    client: 'TokyoTech Lab',
    location: 'TP. Hồ Chí Minh',
    completedDate: '2024-02-10',
    area: '800m²',
    budget: '5-7 tỷ VNĐ',
    images: {
      thumbnail: 'https://cdn.g-3.vn/projects/tokyotech/thumbnail.jpg',
      gallery: [
        'https://cdn.g-3.vn/projects/tokyotech/gallery-1.jpg',
        'https://cdn.g-3.vn/projects/tokyotech/gallery-2.jpg',
        'https://cdn.g-3.vn/projects/tokyotech/gallery-3.jpg'
      ]
    },
    tags: ['Coworking', 'Startup', 'Linh hoạt', 'Sáng tạo'],
    featured: false,
    status: 'completed',
    services: ['Thiết kế nội thất', 'Thi công', 'Cung cấp nội thất']
  },
  {
    id: 'vietcombank-branch',
    title: 'Vietcombank Chi nhánh Đống Đa',
    description: 'Thiết kế và thi công nội thất cho chi nhánh ngân hàng Vietcombank với diện tích 600m². Tập trung vào việc tạo ra không gian chuyên nghiệp và thân thiện với khách hàng.',
    shortDescription: 'Chi nhánh ngân hàng Vietcombank chuyên nghiệp 600m²',
    category: 'corporate',
    client: 'Vietcombank',
    location: 'Hà Nội',
    completedDate: '2023-12-15',
    area: '600m²',
    budget: '8-10 tỷ VNĐ',
    images: {
      thumbnail: 'https://cdn.g-3.vn/projects/vietcombank/thumbnail.jpg',
      gallery: [
        'https://cdn.g-3.vn/projects/vietcombank/gallery-1.jpg',
        'https://cdn.g-3.vn/projects/vietcombank/gallery-2.jpg'
      ]
    },
    tags: ['Ngân hàng', 'Chuyên nghiệp', 'Thân thiện', 'An toàn'],
    featured: false,
    status: 'completed',
    services: ['Thiết kế nội thất', 'Thi công', 'Cung cấp nội thất']
  },
  {
    id: 'bkav-office-renovation',
    title: 'BKAV Office - Cải tạo không gian làm việc',
    description: 'Dự án cải tạo và nâng cấp không gian làm việc cho BKAV với diện tích 1,500m². Tối ưu hóa không gian hiện có để tăng hiệu quả làm việc.',
    shortDescription: 'Cải tạo văn phòng BKAV tối ưu hóa không gian 1,500m²',
    category: 'office',
    client: 'BKAV',
    location: 'Hà Nội',
    completedDate: '2024-04-05',
    area: '1,500m²',
    budget: '10-12 tỷ VNĐ',
    images: {
      thumbnail: 'https://cdn.g-3.vn/projects/bkav/thumbnail.jpg',
      gallery: [
        'https://cdn.g-3.vn/projects/bkav/gallery-1.jpg',
        'https://cdn.g-3.vn/projects/bkav/gallery-2.jpg',
        'https://cdn.g-3.vn/projects/bkav/gallery-3.jpg'
      ]
    },
    tags: ['Cải tạo', 'Tối ưu', 'Công nghệ', 'Hiệu quả'],
    featured: false,
    status: 'completed',
    services: ['Thiết kế nội thất', 'Cải tạo', 'Cung cấp nội thất']
  },
  {
    id: 'ministry-planning-investment',
    title: 'Bộ Kế hoạch và Đầu tư - Hội trường hiện đại',
    description: 'Thiết kế và thi công hội trường và khu vực làm việc cho Bộ Kế hoạch và Đầu tư với diện tích 1,200m². Đảm bảo tính trang trọng và hiện đại phù hợp với cơ quan nhà nước.',
    shortDescription: 'Hội trường Bộ Kế hoạch và Đầu tư trang trọng 1,200m²',
    category: 'government',
    client: 'Bộ Kế hoạch và Đầu tư',
    location: 'Hà Nội',
    completedDate: '2023-10-20',
    area: '1,200m²',
    budget: '12-15 tỷ VNĐ',
    images: {
      thumbnail: 'https://cdn.g-3.vn/projects/ministry/thumbnail.jpg',
      gallery: [
        'https://cdn.g-3.vn/projects/ministry/gallery-1.jpg',
        'https://cdn.g-3.vn/projects/ministry/gallery-2.jpg'
      ]
    },
    tags: ['Cơ quan nhà nước', 'Trang trọng', 'Hội trường', 'Chính thức'],
    featured: false,
    status: 'completed',
    services: ['Thiết kế nội thất', 'Thi công', 'Cung cấp nội thất']
  },
  {
    id: 'hanoi-university-library',
    title: 'Thư viện Đại học Hà Nội - Không gian học tập',
    description: 'Dự án thiết kế không gian thư viện hiện đại cho Đại học Hà Nội với diện tích 2,000m². Tạo ra môi trường học tập thoải mái và hiệu quả cho sinh viên.',
    shortDescription: 'Thư viện Đại học Hà Nội hiện đại 2,000m²',
    category: 'education',
    client: 'Đại học Hà Nội',
    location: 'Hà Nội',
    completedDate: '2024-05-15',
    area: '2,000m²',
    budget: '18-22 tỷ VNĐ',
    images: {
      thumbnail: 'https://cdn.g-3.vn/projects/hanoi-uni/thumbnail.jpg',
      gallery: [
        'https://cdn.g-3.vn/projects/hanoi-uni/gallery-1.jpg',
        'https://cdn.g-3.vn/projects/hanoi-uni/gallery-2.jpg',
        'https://cdn.g-3.vn/projects/hanoi-uni/gallery-3.jpg'
      ]
    },
    tags: ['Giáo dục', 'Thư viện', 'Học tập', 'Hiện đại'],
    featured: false,
    status: 'completed',
    services: ['Thiết kế nội thất', 'Thi công', 'Cung cấp nội thất']
  }
];

// Helper functions
export const getFeaturedProjects = () => projects.filter(project => project.featured);

export const getProjectsByCategory = (categoryId: string) => {
  if (categoryId === 'all') return projects;
  return projects.filter(project => project.category === categoryId);
};

export const getProjectById = (id: string) => projects.find(project => project.id === id);

export const getRecentProjects = (limit: number = 6) => {
  return projects
    .sort((a, b) => new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime())
    .slice(0, limit);
};