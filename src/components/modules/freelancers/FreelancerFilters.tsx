"use client";
import React, { useState } from "react";
import Button from "@/components/ui/Button";

interface FilterState {
  category: string;
  hourlyRate: {
    min: number;
    max: number;
  };
  skills: string[];
  rating: number;
}

interface FreelancerFiltersProps {
  onApplyFilters: (filters: FilterState) => void;
}

export const FreelancerFilters: React.FC<FreelancerFiltersProps> = ({
  onApplyFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    hourlyRate: { min: 0, max: 10000 },
    skills: [],
    rating: 0,
  });

  const categories = [
    "All Categories",
    "Web Development",
    "Mobile Development",
    "Design",
    "Writing",
    "Marketing",
    "IT & Software",
    "Data Entry",
    "Translation",
  ];

  const skillOptions = [
    "React",
    "Angular",
    "Vue",
    "Node.js",
    "Python",
    "Java",
    "PHP",
    "WordPress",
    "Mobile App Development",
    "UI/UX Design",
    "Graphic Design",
    "Content Writing",
    "Digital Marketing",
    "SEO",
  ];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, category: e.target.value });
  };

  const handleSkillToggle = (skill: string) => {
    setFilters((prev) => {
      const updatedSkills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: updatedSkills };
    });
  };

  const handleMinRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setFilters({
      ...filters,
      hourlyRate: { ...filters.hourlyRate, min: value },
    });
  };

  const handleMaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setFilters({
      ...filters,
      hourlyRate: { ...filters.hourlyRate, max: value },
    });
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, rating: parseInt(e.target.value) });
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({
      category: "",
      hourlyRate: { min: 0, max: 10000 },
      skills: [],
      rating: 0,
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
              value={filters.category}
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat === "All Categories" ? "" : cat}>
                  {cat}
                </option>
              ))}
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
                value={filters.hourlyRate.min || ""}
                onChange={handleMinRateChange}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.hourlyRate.max || ""}
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
              value={filters.rating}
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
            {skillOptions.map((skill) => (
              <div key={skill} className="flex items-center">
                <input
                  type="checkbox"
                  id={`skill-${skill}`}
                  checked={filters.skills.includes(skill)}
                  onChange={() => handleSkillToggle(skill)}
                  className="mr-1"
                />
                <label htmlFor={`skill-${skill}`} className="text-sm">
                  {skill}
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
