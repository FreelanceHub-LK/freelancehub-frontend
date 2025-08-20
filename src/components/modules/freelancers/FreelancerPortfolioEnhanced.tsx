"use client";
import React, { useState } from "react";
import { 
  ExternalLink, 
  Eye, 
  Heart, 
  Calendar, 
  Tag, 
  Play, 
  Image as ImageIcon,
  FileText,
  Code,
  Palette,
  Monitor,
  Smartphone,
  Globe
} from "lucide-react";
import Button from "@/components/ui/Button";

interface FreelancerPortfolioEnhancedProps {
  freelancerId: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  technologies: string[];
  projectUrl?: string;
  demoUrl?: string;
  completedDate: string;
  client?: string;
  duration: string;
  type: 'web' | 'mobile' | 'design' | 'video' | 'document' | 'other';
  views: number;
  likes: number;
  featured: boolean;
}

const categoryIcons = {
  web: Monitor,
  mobile: Smartphone,
  design: Palette,
  video: Play,
  document: FileText,
  other: Code
};

const categories = [
  { id: 'all', name: 'All Projects', count: 12 },
  { id: 'web', name: 'Web Development', count: 6 },
  { id: 'mobile', name: 'Mobile Apps', count: 3 },
  { id: 'design', name: 'UI/UX Design', count: 2 },
  { id: 'video', name: 'Video Production', count: 1 }
];

export const FreelancerPortfolioEnhanced: React.FC<FreelancerPortfolioEnhancedProps> = ({
  freelancerId
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);

  // Mock portfolio data
  const portfolioItems: PortfolioItem[] = [
    {
      id: "1",
      title: "E-commerce Platform",
      description: "A complete e-commerce solution with advanced features including payment integration, inventory management, and analytics dashboard.",
      category: "web",
      images: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
      ],
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
      projectUrl: "https://example-ecommerce.com",
      demoUrl: "https://demo.example-ecommerce.com",
      completedDate: "2024-01-15",
      client: "TechCorp Inc.",
      duration: "3 months",
      type: "web",
      views: 234,
      likes: 18,
      featured: true
    },
    {
      id: "2",
      title: "Mobile Banking App",
      description: "Secure and user-friendly mobile banking application with biometric authentication and real-time transaction monitoring.",
      category: "mobile",
      images: [
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop"
      ],
      technologies: ["React Native", "TypeScript", "Firebase", "Plaid API"],
      completedDate: "2023-12-10",
      client: "FinanceSecure",
      duration: "4 months",
      type: "mobile",
      views: 189,
      likes: 25,
      featured: true
    },
    {
      id: "3",
      title: "Brand Identity Design",
      description: "Complete brand identity package including logo design, color palette, typography, and brand guidelines.",
      category: "design",
      images: [
        "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=400&fit=crop"
      ],
      technologies: ["Adobe Illustrator", "Figma", "Adobe Photoshop"],
      completedDate: "2023-11-20",
      client: "StartupXYZ",
      duration: "6 weeks",
      type: "design",
      views: 156,
      likes: 31,
      featured: false
    }
  ];

  const filteredItems = portfolioItems.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const openProjectModal = (item: PortfolioItem) => {
    setSelectedItem(item);
  };

  const closeProjectModal = () => {
    setSelectedItem(null);
  };

  const PortfolioCard = ({ item }: { item: PortfolioItem }) => {
    const IconComponent = categoryIcons[item.type];
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
        {/* Image */}
        <div className="relative overflow-hidden h-48">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
              <button
                onClick={() => openProjectModal(item)}
                className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <Eye size={16} />
                <span>View Details</span>
              </button>
              {item.demoUrl && (
                <a
                  href={item.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <ExternalLink size={16} />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
          
          {/* Featured Badge */}
          {item.featured && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </div>
          )}
          
          {/* Category Icon */}
          <div className="absolute top-3 right-3 bg-white bg-opacity-90 p-2 rounded-full">
            <IconComponent size={16} className="text-gray-700" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
            {item.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1 mb-4">
            {item.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
              >
                {tech}
              </span>
            ))}
            {item.technologies.length > 3 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{item.technologies.length - 3} more
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{formatDate(item.completedDate)}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Eye size={14} />
                <span>{item.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart size={14} />
                <span>{item.likes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PortfolioListItem = ({ item }: { item: PortfolioItem }) => {
    const IconComponent = categoryIcons[item.type];
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex space-x-6">
          {/* Image */}
          <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-white bg-opacity-90 p-1 rounded-full">
              <IconComponent size={12} className="text-gray-700" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                {item.title}
              </h3>
              {item.featured && (
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium ml-2">
                  Featured
                </span>
              )}
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {item.description}
            </p>

            <div className="flex flex-wrap gap-1 mb-3">
              {item.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>{formatDate(item.completedDate)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye size={14} />
                  <span>{item.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart size={14} />
                  <span>{item.likes}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openProjectModal(item)}
                >
                  View Details
                </Button>
                {item.demoUrl && (
                  <a href={item.demoUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm">
                      <ExternalLink size={14} className="mr-1" />
                      Demo
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
          <p className="text-gray-600">Showcase of completed projects and work samples</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Portfolio Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No projects found</h3>
          <p className="text-gray-500">
            No projects in the selected category. Try selecting a different category.
          </p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {filteredItems.map((item) => (
            viewMode === 'grid' ? (
              <PortfolioCard key={item.id} item={item} />
            ) : (
              <PortfolioListItem key={item.id} item={item} />
            )
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Completed in {formatDate(selectedItem.completedDate)}</span>
                    <span>•</span>
                    <span>Duration: {selectedItem.duration}</span>
                    {selectedItem.client && (
                      <>
                        <span>•</span>
                        <span>Client: {selectedItem.client}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={closeProjectModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Project Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {selectedItem.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${selectedItem.title} - Image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>

              {/* Project Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Project Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedItem.description}</p>
              </div>

              {/* Technologies Used */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {selectedItem.demoUrl && (
                  <a href={selectedItem.demoUrl} target="_blank" rel="noopener noreferrer">
                    <Button>
                      <ExternalLink size={16} className="mr-2" />
                      View Live Demo
                    </Button>
                  </a>
                )}
                {selectedItem.projectUrl && (
                  <a href={selectedItem.projectUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Globe size={16} className="mr-2" />
                      Project Website
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
