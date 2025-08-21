"use client";
import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { skillsApi } from '@/lib/api/registration';

interface Skill {
  id: string;
  name: string;
  category?: string;
}

interface SkillsSelectionProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  onNext: () => void;
  onSkip: () => void;
  isLoading?: boolean;
  className?: string;
}

// Fallback skills data in case API is not available
const FALLBACK_SKILLS = [
  { id: '1', name: 'JavaScript', category: 'Programming' },
  { id: '2', name: 'React', category: 'Frontend' },
  { id: '3', name: 'Node.js', category: 'Backend' },
  { id: '4', name: 'Python', category: 'Programming' },
  { id: '5', name: 'UI/UX Design', category: 'Design' },
  { id: '6', name: 'Figma', category: 'Design' },
  { id: '7', name: 'WordPress', category: 'CMS' },
  { id: '8', name: 'Content Writing', category: 'Writing' },
  { id: '9', name: 'Digital Marketing', category: 'Marketing' },
  { id: '10', name: 'SEO', category: 'Marketing' },
  { id: '11', name: 'Data Analysis', category: 'Analytics' },
  { id: '12', name: 'Machine Learning', category: 'AI' },
];

const SKILL_CATEGORIES = [
  'Programming',
  'Frontend',
  'Backend',
  'Design',
  'Writing',
  'Marketing',
  'Analytics',
  'AI',
  'CMS',
  'Mobile'
];

export function SkillsSelection({
  selectedSkills,
  onSkillsChange,
  onNext,
  onSkip,
  isLoading = false,
  className = ""
}: SkillsSelectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const [availableSkills, setAvailableSkills] = useState<Skill[]>(FALLBACK_SKILLS);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>(FALLBACK_SKILLS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loadingSkills, setLoadingSkills] = useState(false);

  // Load skills from API on component mount
  useEffect(() => {
    const loadSkills = async () => {
      setLoadingSkills(true);
      try {
        const skills = await skillsApi.getSkills();
        if (skills && skills.length > 0) {
          const mappedSkills = skills.map(skill => ({
            id: skill.id,
            name: skill.name,
            category: skill.category || 'Other'
          }));
          setAvailableSkills(mappedSkills);
        }
      } catch (error) {
        console.error('Failed to load skills:', error);
        // Keep using fallback skills
      } finally {
        setLoadingSkills(false);
      }
    };

    loadSkills();
  }, []);

  useEffect(() => {
    let filtered = availableSkills;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSkills(filtered);
  }, [searchTerm, selectedCategory, availableSkills]);

  const handleSkillToggle = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      onSkillsChange(selectedSkills.filter(skill => skill !== skillName));
    } else {
      onSkillsChange([...selectedSkills, skillName]);
    }
  };

  const handleAddCustomSkill = async () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      try {
        // Try to add the skill to the backend
        await skillsApi.addSkill({ name: customSkill.trim() });
        // Add to local state
        const newSkill = { 
          id: Date.now().toString(), 
          name: customSkill.trim(), 
          category: 'Other' 
        };
        setAvailableSkills(prev => [...prev, newSkill]);
      } catch (error) {
        console.error('Failed to add custom skill:', error);
        // Still add it locally for the user
      }
      
      onSkillsChange([...selectedSkills, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    onSkillsChange(selectedSkills.filter(skill => skill !== skillName));
  };

  const isSkillSelected = (skillName: string) => selectedSkills.includes(skillName);

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
          What are your skills?
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Add your skills to help clients find you more easily. You can always update these later.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Search and Controls */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search and Filter */}
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              disabled={isLoading || loadingSkills}
            />
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50"
              disabled={isLoading || loadingSkills}
            >
              <option value="all">All Categories</option>
              {SKILL_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Add Custom Skill */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Add Custom Skill</label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type a skill..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill()}
                disabled={isLoading || loadingSkills}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddCustomSkill}
                disabled={!customSkill.trim() || isLoading || loadingSkills}
                className="px-3"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Selected Skills Summary */}
          {selectedSkills.length > 0 && (
            <div className="bg-green-50 p-3 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Selected ({selectedSkills.length})
              </h3>
              <div className="flex flex-wrap gap-1">
                {selectedSkills.slice(0, 8).map((skill) => (
                  <Badge
                    key={skill}
                    variant="success"
                    className="text-xs px-2 py-1"
                  >
                    {skill.length > 12 ? `${skill.substring(0, 12)}...` : skill}
                  </Badge>
                ))}
                {selectedSkills.length > 8 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{selectedSkills.length - 8} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <Button
              onClick={onNext}
              disabled={selectedSkills.length === 0 || isLoading || loadingSkills}
              isLoading={isLoading}
              className="w-full"
            >
              Continue ({selectedSkills.length} skills)
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onSkip}
              disabled={isLoading || loadingSkills}
              className="w-full"
            >
              Skip for now
            </Button>
          </div>
        </div>

        {/* Right Column - Skills Grid and Selected Skills */}
        <div className="lg:col-span-2 space-y-4">
          {/* Selected Skills - Full View */}
          {selectedSkills.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Selected Skills ({selectedSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="success"
                    className="flex items-center gap-1 px-3 py-1 text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:text-red-600 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Skills Grid */}
          {loadingSkills ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading skills...</p>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {selectedCategory === "all" ? "Available Skills" : `${selectedCategory} Skills`}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 max-h-96 overflow-y-auto pr-2">
                {filteredSkills.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => handleSkillToggle(skill.name)}
                    disabled={isLoading}
                    className={`
                      px-3 py-2 text-sm border rounded-md transition-all duration-200
                      ${isSkillSelected(skill.name)
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-green-500 hover:bg-green-50'
                      }
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      flex items-center justify-center gap-1 text-center
                    `}
                  >
                    {isSkillSelected(skill.name) && <Check className="w-3 h-3" />}
                    <span className="truncate">{skill.name}</span>
                  </button>
                ))}
              </div>

              {filteredSkills.length === 0 && searchTerm && !loadingSkills && (
                <div className="text-center py-8 text-gray-500">
                  <p>No skills found matching "{searchTerm}"</p>
                  <p className="text-sm">Try adding it as a custom skill.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-gray-500">
          Don't worry, you can always add more skills or modify these in your profile settings later.
        </p>
      </div>
    </div>
  );
}
