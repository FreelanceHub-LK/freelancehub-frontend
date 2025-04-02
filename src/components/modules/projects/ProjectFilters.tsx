"use client";
import React, { useState } from 'react';
// Fixed import to match your actual component export
import Button from '@/components/ui/Button'; // This is correct based on your export
import { Search, Filter, X } from 'lucide-react';

interface ProjectFiltersProps {
  onApplyFilters: (filters: any) => void;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({ onApplyFilters }) => {
  const [keyword, setKeyword] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const categories = ['Web Development', 'Mobile App', 'Design', 'Content Writing', 'Marketing', 'Data Entry'];
  
  const handleApplyFilters = () => {
    onApplyFilters({
      keyword,
      budget: {
        min: minBudget ? parseInt(minBudget) : undefined,
        max: maxBudget ? parseInt(maxBudget) : undefined,
      },
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    });
  };
  
  const handleClearFilters = () => {
    setKeyword('');
    setMinBudget('');
    setMaxBudget('');
    setSelectedCategories([]);
    onApplyFilters({});
  };
  
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search projects..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md pl-10"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        <Button 
          variant="outline" 
          className="ml-2"
          icon={<Filter size={16} />} // Your Button component supports the icon prop
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
        </Button>
        <Button className="ml-2" onClick={handleApplyFilters}>
          Search
        </Button>
      </div>
      
      {showFilters && (
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium">Filters</h3>
            <button 
              className="text-sm text-gray-500 flex items-center"
              onClick={handleClearFilters}
            >
              <X size={14} className="mr-1" />
              Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range (LKR)</label>
              <div className="flex items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <span className="mx-2">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategories.includes(category)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};