import React, { useState, useMemo } from 'react';
import { projects, projectCategories, type Project } from '../../data/projects';

const ProjectsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = useMemo(() => {
    let filtered = projects;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  }, [selectedCategory, searchTerm]);

  const featuredProjects = projects.filter(project => project.featured);

  return (
    <div className="projects-page">
      {/* Hero Section */}
      <section className="projects-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
              Dự Án Tiêu Biểu
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-6 md:mb-8">
              Khám phá những dự án nội thất văn phòng đẳng cấp mà chúng tôi đã thực hiện
            </p>
            <div className="stats-cards">
              <div className="stats-card">
                <div className="stats-number">{projects.length}+</div>
                <div className="stats-label">Dự án hoàn thành</div>
              </div>
              <div className="stats-card">
                <div className="stats-number">500+</div>
                <div className="stats-label">Khách hàng hài lòng</div>
              </div>
              <div className="stats-card">
                <div className="stats-number">50,000+</div>
                <div className="stats-label">m² đã thi công</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            Dự Án Nổi Bật
          </h2>
          <div className="featured-projects-grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} featured />
            ))}
          </div>
        </div>
      </section>

      {/* Filter and Search */}
      <section className="filter-section">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full lg:w-auto">
              <input
                type="text"
                placeholder="Tìm kiếm dự án..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            {/* Category Filter */}
            <div className="filter-buttons">
              {projectCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`filter-button ${selectedCategory === category.id ? 'active' : ''}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Projects */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Tất Cả Dự Án
              {filteredProjects.length !== projects.length && (
                <span className="text-lg font-normal text-gray-600 ml-2">
                  ({filteredProjects.length} kết quả)
                </span>
              )}
            </h2>
          </div>
          
          {filteredProjects.length > 0 ? (
            <div className="projects-grid all-projects">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">
                Không tìm thấy dự án nào
              </h3>
              <p className="empty-state-description">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc danh mục
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Bạn có dự án cần tư vấn?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi để được tư vấn miễn phí và nhận báo giá chi tiết cho dự án của bạn
          </p>
          <div className="cta-buttons">
            <a href="tel:0947776662" className="cta-button-primary">
              📞 Gọi ngay: 0979 983 355
            </a>
            <a href="/lien-he" className="cta-button-secondary">
              💬 Tư vấn miễn phí
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, featured = false }) => {
  const categoryName = projectCategories.find(cat => cat.id === project.category)?.name || project.category;
  
  return (
    <div className={`project-card ${featured ? 'featured' : ''}`}>
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={project.images.thumbnail}
          alt={project.title}
          className="project-card-image"
          loading="lazy"
        />
        {featured && (
          <div className="featured-badge">
            Nổi bật
          </div>
        )}
        <div className="category-badge">
          {categoryName}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 md:p-6">
        <h3 className="font-bold text-lg md:text-xl mb-2 line-clamp-2">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.shortDescription}
        </p>
        
        {/* Project Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium mr-2">Khách hàng:</span>
            <span>{project.client}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium mr-2">Diện tích:</span>
            <span>{project.area}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium mr-2">Địa điểm:</span>
            <span>{project.location}</span>
          </div>
        </div>
        
        {/* Tags */}
        <div className="project-tags">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="project-tag">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-gray-400 text-xs px-2 py-1">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
        
        {/* CTA */}
        <a 
          href={`/du-an/${project.id}`}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors text-center block"
        >
          Xem chi tiết
        </a>
      </div>
    </div>
  );
};

export default ProjectsPage;