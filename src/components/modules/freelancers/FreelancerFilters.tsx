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
    setFilters({ ...filters, categories: [e.target.value] });
  };

  const handleSkillToggle = (skill: string) => {
    setFilters((prev) => {
      const updatedSkills = (prev.skills || []).includes(skill)
        ? (prev.skills || []).filter((s) => s !== skill)
        : [...(prev.skills || []), skill];
      return { ...prev, skills: updatedSkills };
    });
  };

  const handleMinRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setFilters({
      ...filters,
      minRate: value,
    });
  };

  const handleMaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setFilters({
      ...filters,
      maxRate: value,
    });
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, minRating: parseInt(e.target.value) });
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({
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
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          className="text-blue-600 text-sm font-medium"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Collapse" : "Expand"} Filters
        </button>
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
                onChange={handleMinRateChange}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.maxRate || ""}
                onChange={handleMaxRateChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Minimum Rating
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={filters.minRating || 0}
              onChange={handleRatingChange}
              title="Minimum Rating"
              aria-label="Minimum Rating"
            >
              <option value={0}>Any Rating</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
              <option value={5}>5 Stars</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Skills</label>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 10).map((skill) => (
              <div key={skill.name} className="flex items-center">
                <input
                  type="checkbox"
                  id={`skill-${skill.name}`}
                  checked={(filters.skills || []).includes(skill.name)}
                  onChange={() => handleSkillToggle(skill.name)}
                  className="mr-1"
                />
                <label htmlFor={`skill-${skill.name}`} className="text-sm">
                  {skill.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </div>
      </div>
    </div>
  );
};
