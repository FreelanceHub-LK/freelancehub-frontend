"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { useSkills } from "@/hooks/useFreelancers";
import { FreelancerFilters as IFreelancerFilters } from "@/lib/api/freelancer";

interface FreelancerFiltersProps {
  onApplyFilters: (filters: IFreelancerFilters) => void;
  initialFilters?: IFreelancerFilters;
}

export const FreelancerFilters: React.FC<FreelancerFiltersProps> = ({
  onApplyFilters,
  initialFilters = {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { skills, categories, popularSkills, loading: skillsLoading } = useSkills();
  
  const [filters, setFilters] = useState<IFreelancerFilters>({
    skills: [],
    minRate: 0,
    maxRate: 10000,
    minRating: 0,
    location: "",
    availability: undefined,
    categories: [],
    search: "",
    sortBy: "rating",
    sortOrder: "desc",
    ...initialFilters
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialFilters.skills || []);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [skillSearchResults, setSkillSearchResults] = useState<any[]>([]);

  const allCategories = [
    "All Categories",
    "Web Development", 
    "Mobile Development",
    "UI/UX Design",
    "Data Science",
    "Digital Marketing",
    "Content Writing",
    "Graphic Design",
    "Software Development",
    "DevOps",
    ...categories
  ];

  useEffect(() => {
    if (skillSearchQuery.trim()) {
      const filtered = skills.filter(skill => 
        skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase())
      );
      setSkillSearchResults(filtered);
    } else {
      setSkillSearchResults([]);
    }
  }, [skillSearchQuery, skills]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters(prev => ({ 
      ...prev, 
      categories: value === "All Categories" ? [] : [value] 
    }));
  };

  const handleSkillToggle = (skillName: string) => {
    const updatedSkills = selectedSkills.includes(skillName)
      ? selectedSkills.filter(s => s !== skillName)
      : [...selectedSkills, skillName];
    
    setSelectedSkills(updatedSkills);
    setFilters(prev => ({ ...prev, skills: updatedSkills }));
  };

  const handleMinRateChange = (value: number) => {
    setFilters(prev => ({ ...prev, minRate: value }));
  };

  const handleMaxRateChange = (value: number) => {
    setFilters(prev => ({ ...prev, maxRate: value }));
  };

  const handleRatingChange = (rating: number) => {
    setFilters(prev => ({ ...prev, minRating: rating }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, location: e.target.value }));
  };

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters(prev => ({ 
      ...prev, 
      availability: value === "all" ? undefined : value === "available" 
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    setFilters(prev => ({ 
      ...prev, 
      sortBy: sortBy as any, 
      sortOrder: sortOrder as 'asc' | 'desc' 
    }));
  };

  const applyFilters = () => {
    onApplyFilters(filters);
  };

  const clearFilters = () => {
    const clearedFilters: IFreelancerFilters = {
      skills: [],
      minRate: 0,
      maxRate: 10000,
      minRating: 0,
      location: "",
      availability: undefined,
      categories: [],
      search: "",
      sortBy: "rating",
      sortOrder: "desc"
    };
    setFilters(clearedFilters);
    setSelectedSkills([]);
    setSkillSearchQuery("");
    onApplyFilters(clearedFilters);
  };

  const addSkillFromSearch = (skillName: string) => {
    if (!selectedSkills.includes(skillName)) {
      handleSkillToggle(skillName);
    }
    setSkillSearchQuery("");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filter Freelancers</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden"
          >
            {isExpanded ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button variant="outline" onClick={clearFilters} size="sm">
            Clear All
          </Button>
          <Button onClick={applyFilters} size="sm">
            Apply Filters
          </Button>
        </div>
      </div>

      <div className={`${isExpanded ? "block" : "hidden md:block"}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              title="Category List"
              value={filters.categories?.[0] || ""}
              onChange={handleCategoryChange}
            >
              {allCategories.map((cat, index) => {
                const catValue = typeof cat === 'string' ? cat : cat.name;
                const catKey = typeof cat === 'string' ? cat : cat._id;
                return (
                  <option key={catKey} value={catValue === "All Categories" ? "" : catValue}>
                    {catValue}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Hourly Rate (Rs.)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.minRate || ""}
                onChange={(e) => handleMinRateChange(Number(e.target.value))}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.maxRate || ""}
                onChange={(e) => handleMaxRateChange(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              placeholder="Enter location"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={filters.location || ""}
              onChange={handleLocationChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Availability</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={
                filters.availability === undefined 
                  ? "all" 
                  : filters.availability 
                    ? "available" 
                    : "unavailable"
              }
              onChange={handleAvailabilityChange}
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Minimum Rating</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`p-1 ${
                    (filters.minRating || 0) >= rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="text-sm text-gray-600">
                {filters.minRating || 0}+ stars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={handleSortChange}
            >
              <option value="rating-desc">Highest Rated</option>
              <option value="rating-asc">Lowest Rated</option>
              <option value="hourlyRate-desc">Highest Rate</option>
              <option value="hourlyRate-asc">Lowest Rate</option>
              <option value="completedProjects-desc">Most Projects</option>
              <option value="memberSince-desc">Newest Members</option>
              <option value="memberSince-asc">Oldest Members</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Skills</label>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Search skills..."
              className="w-full p-2 border border-gray-300 rounded-md"
              value={skillSearchQuery}
              onChange={(e) => setSkillSearchQuery(e.target.value)}
            />
            {skillSearchResults.length > 0 && (
              <div className="mt-1 max-h-32 overflow-y-auto border border-gray-200 rounded-md">
                {skillSearchResults.map((skill) => (
                  <button
                    key={skill.id}
                    className="w-full text-left px-3 py-1 hover:bg-gray-100"
                    onClick={() => addSkillFromSearch(skill.name)}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-2">
            <h4 className="text-sm font-medium mb-1">Popular Skills</h4>
            <div className="flex flex-wrap gap-1">
              {popularSkills.slice(0, 10).map((skill) => (
                <button
                  key={skill._id}
                  onClick={() => handleSkillToggle(skill.name)}
                  className={`px-2 py-1 rounded-full text-xs border ${
                    selectedSkills.includes(skill.name)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {skill.name}
                </button>
              ))}
            </div>
          </div>

          {selectedSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Selected Skills</h4>
              <div className="flex flex-wrap gap-1">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs flex items-center"
                  >
                    {skill}
                    <button
                      onClick={() => handleSkillToggle(skill)}
                      className="ml-1 hover:text-red-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
