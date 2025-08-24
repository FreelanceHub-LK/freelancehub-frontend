"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Plus, X, ArrowRight, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { skillsApi, Skill } from "@/lib/api/skills";
import { toast } from "@/context/toast-context";

interface SkillsStepProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isLoading: boolean;
}

const POPULAR_SKILLS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "PHP", 
  "Java", "C#", "HTML/CSS", "Vue.js", "Angular", "Laravel", 
  "Django", "MongoDB", "MySQL", "PostgreSQL", "AWS", "Docker",
  "UI/UX Design", "Figma", "Photoshop", "Content Writing", "SEO"
];

export function SkillsStep({ 
  skills, 
  onSkillsChange, 
  onNext, 
  onBack, 
  onSkip, 
  isLoading 
}: SkillsStepProps) {
  const [skillInput, setSkillInput] = useState("");
  const [searchResults, setSearchResults] = useState<Skill[]>([]);
  const [popularSkills, setPopularSkills] = useState<Skill[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load popular skills from backend
  useEffect(() => {
    const loadPopularSkills = async () => {
      try {
        const skills = await skillsApi.getPopularSkills(20);
        setPopularSkills(skills);
      } catch (error) {
        console.error("Failed to load popular skills:", error);
        // Fallback to predefined skills
        const fallbackSkills: Skill[] = POPULAR_SKILLS.map((skill, index) => ({
          _id: `fallback-${index}`,
          name: skill,
          popularity: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
        setPopularSkills(fallbackSkills);
      }
    };

    loadPopularSkills();
  }, []);

  // Search skills when user types
  useEffect(() => {
    const searchSkills = async () => {
      if (skillInput.trim().length > 2) {
        setIsSearching(true);
        try {
          const results = await skillsApi.searchSkills(skillInput.trim());
          setSearchResults(results);
        } catch (error) {
          console.error("Failed to search skills:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    const timeoutId = setTimeout(searchSkills, 300);
    return () => clearTimeout(timeoutId);
  }, [skillInput]);

  const handleSkillAdd = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      onSkillsChange([...skills, trimmedSkill]);
    }
    setSkillInput("");
    setSearchResults([]);
  };

  const handleCustomSkillAdd = () => {
    if (skillInput.trim()) {
      handleSkillAdd(skillInput);
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomSkillAdd();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            What Are Your Skills?
          </h2>
          <p className="text-gray-600 text-lg">
            Add skills that showcase your expertise and help clients find you
          </p>
        </div>

        {/* Skill Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search and add skills
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a skill (e.g., JavaScript, Python, Design)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
            />
            {skillInput && (
              <button
                onClick={handleCustomSkillAdd}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-600 hover:text-green-700"
              >
                <Plus className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map((skill) => (
                <button
                  key={skill._id}
                  onClick={() => handleSkillAdd(skill.name)}
                  disabled={skills.includes(skill.name)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between ${
                    skills.includes(skill.name) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>{skill.name}</span>
                  {skills.includes(skill.name) && (
                    <span className="text-xs text-green-600">Added</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Your Skills ({skills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-green-100 text-green-800 px-3 py-2 rounded-full flex items-center gap-2"
                >
                  <span className="font-medium">{skill}</span>
                  <button
                    onClick={() => handleSkillRemove(skill)}
                    className="text-green-600 hover:text-green-800 hover:bg-green-200 rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Skills */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Popular Skills
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {popularSkills.slice(0, 12).map((skill) => (
              <button
                key={skill._id}
                onClick={() => handleSkillAdd(skill.name)}
                disabled={skills.includes(skill.name)}
                className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                  skills.includes(skill.name)
                    ? 'bg-green-100 border-green-300 text-green-700 cursor-not-allowed'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{skill.name}</div>
                {skills.includes(skill.name) && (
                  <div className="text-xs text-green-600 mt-1">✓ Added</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">
            {skills.length === 0 
              ? "Add at least one skill to continue" 
              : `Great! You've added ${skills.length} skill${skills.length > 1 ? 's' : ''}`
            }
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <Button
              onClick={onSkip}
              variant="ghost"
              className="text-gray-600 hover:text-gray-800"
            >
              Skip for now
            </Button>
            <Button
              onClick={onNext}
              disabled={skills.length === 0 || isLoading}
              isLoading={isLoading}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
