"use client";
import React, { useState } from "react";
import { 
  User, 
  Camera, 
  MapPin, 
  Globe, 
  Star, 
  Plus, 
  X, 
  Save, 
  Eye,
  EyeOff,
  Calendar,
  DollarSign,
  Clock,
  Award,
  Upload
} from "lucide-react";
import Button from "@/components/ui/Button";

interface FreelancerProfileSettingsProps {
  userId: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export const FreelancerProfileSettings: React.FC<FreelancerProfileSettingsProps> = ({
  userId
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'professional' | 'portfolio' | 'rates'>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    // Basic Info
    firstName: 'John',
    lastName: 'Doe',
    title: 'Full Stack Developer',
    bio: 'Experienced developer with 5+ years in web development...',
    location: 'New York, USA',
    timezone: 'UTC-5',
    languages: ['English (Native)', 'Spanish (Fluent)'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    
    // Professional Info
    experience: '5+ years',
    hourlyRate: 50,
    availability: 'full-time' as 'full-time' | 'part-time' | 'not-available',
    skills: [
      { id: '1', name: 'React', level: 'expert' as const },
      { id: '2', name: 'Node.js', level: 'expert' as const },
      { id: '3', name: 'TypeScript', level: 'intermediate' as const }
    ] as Skill[],
    education: [
      { id: '1', degree: 'B.S. Computer Science', institution: 'MIT', year: '2018' }
    ] as Education[],
    certifications: [
      { id: '1', name: 'AWS Certified Developer', issuer: 'Amazon', date: '2023', credentialUrl: 'https://aws.amazon.com/certification/' }
    ] as Certification[],
    
    // Settings
    profileVisibility: 'public' as 'public' | 'private',
    emailNotifications: true,
    profileCompleteness: 85
  });

  const handleInputChange = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (skillName: string, level: 'beginner' | 'intermediate' | 'expert') => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: skillName,
      level
    };
    setProfileData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const removeSkill = (skillId: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== skillId)
    }));
  };

  const addEducation = (education: Omit<Education, 'id'>) => {
    const newEducation: Education = {
      id: Date.now().toString(),
      ...education
    };
    setProfileData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const removeEducation = (educationId: string) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== educationId)
    }));
  };

  const addCertification = (certification: Omit<Certification, 'id'>) => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      ...certification
    };
    setProfileData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCertification]
    }));
  };

  const removeCertification = (certificationId: string) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== certificationId)
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const SkillLevelBadge = ({ level }: { level: string }) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      expert: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level as keyof typeof colors]}`}>
        {level}
      </span>
    );
  };

  const ProfileCompleteness = () => {
    const percentage = profileData.profileCompleteness;
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-blue-900">Profile Completeness</h3>
          <span className="text-blue-700 font-semibold">{percentage}%</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-blue-700 mt-2">
          Complete your profile to get more visibility and better opportunities
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your freelancer profile and preferences</p>
      </div>

      <ProfileCompleteness />

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'basic', name: 'Basic Info', icon: User },
            { id: 'professional', name: 'Professional', icon: Award },
            { id: 'portfolio', name: 'Portfolio', icon: Star },
            { id: 'rates', name: 'Rates & Availability', icon: DollarSign }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent size={20} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            
            {/* Profile Photo */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={profileData.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                  <Camera size={16} />
                </button>
              </div>
              <div>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Upload size={16} />
                  <span>Change Photo</span>
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  JPG, PNG up to 5MB. Recommended size: 400x400px
                </p>
              </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Professional Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Title
              </label>
              <input
                type="text"
                value={profileData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Full Stack Developer, UI/UX Designer"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell clients about your experience, skills, and what makes you unique..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {profileData.bio.length}/500 characters
              </p>
            </div>

            {/* Location & Timezone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin size={20} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City, Country"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={profileData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="UTC-12">UTC-12</option>
                  <option value="UTC-8">UTC-8 (PST)</option>
                  <option value="UTC-5">UTC-5 (EST)</option>
                  <option value="UTC+0">UTC+0 (GMT)</option>
                  <option value="UTC+5:30">UTC+5:30 (IST)</option>
                </select>
              </div>
            </div>

            {/* Profile Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Profile Visibility
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="public"
                    checked={profileData.profileVisibility === 'public'}
                    onChange={(e) => handleInputChange('profileVisibility', e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex items-center">
                    <Eye size={16} className="mr-2 text-green-600" />
                    <span>Public - Visible to all clients</span>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="private"
                    checked={profileData.profileVisibility === 'private'}
                    onChange={(e) => handleInputChange('profileVisibility', e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex items-center">
                    <EyeOff size={16} className="mr-2 text-red-600" />
                    <span>Private - Only visible to invited clients</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'professional' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Professional Information</h2>
            
            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Skills & Expertise
              </label>
              <div className="space-y-3">
                {profileData.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{skill.name}</span>
                      <SkillLevelBadge level={skill.level} />
                    </div>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                  <Plus size={16} />
                  <span>Add Skill</span>
                </Button>
              </div>
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Education
              </label>
              <div className="space-y-3">
                {profileData.education.map((edu) => (
                  <div key={edu.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div>
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </div>
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                  <Plus size={16} />
                  <span>Add Education</span>
                </Button>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Certifications
              </label>
              <div className="space-y-3">
                {profileData.certifications.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div>
                      <h4 className="font-medium">{cert.name}</h4>
                      <p className="text-gray-600">{cert.issuer}</p>
                      <p className="text-sm text-gray-500">{cert.date}</p>
                      {cert.credentialUrl && (
                        <a 
                          href={cert.credentialUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center mt-1"
                        >
                          <Globe size={14} className="mr-1" />
                          View Credential
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => removeCertification(cert.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                  <Plus size={16} />
                  <span>Add Certification</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rates' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Rates & Availability</h2>
            
            {/* Hourly Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hourly Rate (USD)
              </label>
              <div className="relative max-w-xs">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={profileData.hourlyRate}
                  onChange={(e) => handleInputChange('hourlyRate', parseInt(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="5"
                  max="500"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Set your hourly rate based on your skills and experience
              </p>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Availability Status
              </label>
              <div className="space-y-3">
                {[
                  { value: 'full-time', label: 'Available Full-time', desc: 'I can work 40+ hours per week' },
                  { value: 'part-time', label: 'Available Part-time', desc: 'I can work up to 20 hours per week' },
                  { value: 'not-available', label: 'Not Available', desc: 'I am not taking new projects right now' }
                ].map((option) => (
                  <label key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      value={option.value}
                      checked={profileData.availability === option.value}
                      onChange={(e) => handleInputChange('availability', e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-end space-x-4">
          <Button variant="outline">
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save size={16} />
            )}
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
