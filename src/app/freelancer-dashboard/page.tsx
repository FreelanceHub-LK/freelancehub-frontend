"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import { freelancerApi, CreateFreelancerDto, UpdateFreelancerDto } from "@/lib/api/freelancer";
import { skillsApi } from "@/lib/api/skills";
import { toast } from "@/context/toast-context";
import { 
  User, 
  Settings, 
  DollarSign, 
  Star, 
  Briefcase, 
  Clock, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  BarChart3,
  MessageSquare,
  Calendar
} from "lucide-react";

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'portfolio' | 'earnings' | 'settings'>('overview');
  const [freelancerProfile, setFreelancerProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<any[]>([]);
  
  const [profileData, setProfileData] = useState({
    skills: [] as string[],
    hourlyRate: 0,
    education: '',
    isAvailable: true,
    certifications: [] as string[],
    portfolioLinks: [] as string[],
    bio: ''
  });

  useEffect(() => {
    fetchFreelancerData();
    fetchSkills();
  }, []);

  const fetchFreelancerData = async () => {
    try {
      if (user?.id) {
        const profile = await freelancerApi.getFreelancer(user.id);
        setFreelancerProfile(profile);
        setProfileData({
          skills: profile.skills || [],
          hourlyRate: profile.hourlyRate || 0,
          education: profile.education || '',
          isAvailable: profile.isAvailable ?? true,
          certifications: profile.certifications || [],
          portfolioLinks: profile.portfolioLinks || [],
          bio: profile.bio || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch freelancer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const allSkills = await skillsApi.getAllSkills();
      setSkills(allSkills);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      if (freelancerProfile) {
        await freelancerApi.updateFreelancerProfile(freelancerProfile._id, profileData);
        toast.success('Profile updated successfully!');
      } else if (user) {
        const createData: CreateFreelancerDto = {
          firstName: user.name?.split(' ')[0] || '',
          lastName: user.name?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          role: 'freelancer' as any,
          ...profileData
        };
        await freelancerApi.createFreelancerProfile(createData);
        toast.success('Profile created successfully!');
      }
      setIsEditing(false);
      fetchFreelancerData();
    } catch (error) {
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillToggle = (skillName: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillName)
        ? prev.skills.filter(s => s !== skillName)
        : [...prev.skills, skillName]
    }));
  };

  const addCertification = () => {
    const certification = prompt('Enter certification name:');
    if (certification) {
      setProfileData(prev => ({
        ...prev,
        certifications: [...prev.certifications, certification]
      }));
    }
  };

  const removeCertification = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const addPortfolioLink = () => {
    const link = prompt('Enter portfolio URL:');
    if (link) {
      setProfileData(prev => ({
        ...prev,
        portfolioLinks: [...prev.portfolioLinks, link]
      }));
    }
  };

  const removePortfolioLink = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Freelancer Dashboard</h1>
              <p className="text-gray-600">Manage your profile and track your progress</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href={`/freelancers/${user?.id}`}>
                <Button 
                  variant="outline" 
                  icon={<Eye size={16} />}
                >
                  View Public Profile
                </Button>
              </Link>
              <div className={`px-3 py-1 rounded-full text-sm ${
                profileData.isAvailable 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {profileData.isAvailable ? 'Available' : 'Busy'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <img
                  src={
                    (user && 'image' in user && user.image) || 
                    (user && 'profilePicture' in user && user.profilePicture) || 
                    "/api/placeholder/80/80"
                  }
                  alt={user?.name || "User"}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <h3 className="font-semibold">{user?.name}</h3>
                <p className="text-gray-600 text-sm">{freelancerProfile?.bio || "Freelancer"}</p>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
                  { id: 'earnings', label: 'Earnings', icon: DollarSign },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-left ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon size={16} className="mr-3" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="text-blue-600" size={24} />
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-600 text-sm">Hourly Rate</p>
                        <p className="text-2xl font-bold">Rs. {profileData.hourlyRate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Star className="text-green-600" size={24} />
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-600 text-sm">Rating</p>
                        <p className="text-2xl font-bold">{freelancerProfile?.rating?.toFixed(1) || '0.0'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Briefcase className="text-purple-600" size={24} />
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-600 text-sm">Projects</p>
                        <p className="text-2xl font-bold">{freelancerProfile?.completedProjects || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <MessageSquare className="text-yellow-600" size={24} />
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-600 text-sm">Reviews</p>
                        <p className="text-2xl font-bold">{freelancerProfile?.reviewCount || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('profile')}
                      icon={<Edit size={16} />}
                    >
                      Edit Profile
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('portfolio')}
                      icon={<Plus size={16} />}
                    >
                      Add Portfolio
                    </Button>
                    <Button 
                      variant="outline"
                      icon={<Calendar size={16} />}
                    >
                      View Calendar
                    </Button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-2" />
                      <span>Profile updated 2 hours ago</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MessageSquare size={16} className="mr-2" />
                      <span>New message received</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star size={16} className="mr-2" />
                      <span>Received 5-star review</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Profile Settings</h2>
                    <div className="space-x-2">
                      {isEditing ? (
                        <>
                          <Button onClick={handleSaveProfile} size="sm">
                            Save Changes
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditing(false)} 
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)} size="sm">
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      rows={3}
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-md disabled:bg-gray-50"
                      placeholder="Tell clients about yourself and your expertise..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Hourly Rate (Rs.)</label>
                      <input
                        type="number"
                        value={profileData.hourlyRate}
                        onChange={(e) => setProfileData(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-md disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Availability</label>
                      <select
                        value={profileData.isAvailable ? 'available' : 'busy'}
                        onChange={(e) => setProfileData(prev => ({ ...prev, isAvailable: e.target.value === 'available' }))}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-md disabled:bg-gray-50"
                      >
                        <option value="available">Available</option>
                        <option value="busy">Busy</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Education</label>
                    <input
                      type="text"
                      value={profileData.education}
                      onChange={(e) => setProfileData(prev => ({ ...prev, education: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-md disabled:bg-gray-50"
                      placeholder="Your educational background"
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Skills</label>
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border border-gray-200 p-3 rounded-md">
                          {skills.map((skill) => (
                            <button
                              key={skill.id}
                              onClick={() => handleSkillToggle(skill.name)}
                              className={`px-2 py-1 rounded-full text-xs border ${
                                profileData.skills.includes(skill.name)
                                  ? 'bg-blue-500 text-white border-blue-500'
                                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                              }`}
                            >
                              {skill.name}
                            </button>
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">
                          Selected: {profileData.skills.join(', ') || 'None'}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profileData.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Certifications */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">Certifications</label>
                      {isEditing && (
                        <Button size="sm" variant="outline" onClick={addCertification}>
                          <Plus size={14} className="mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {profileData.certifications.map((cert, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>{cert}</span>
                          {isEditing && (
                            <button
                              onClick={() => removeCertification(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      {profileData.certifications.length === 0 && (
                        <p className="text-gray-500 text-sm">No certifications added</p>
                      )}
                    </div>
                  </div>

                  {/* Portfolio Links */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">Portfolio Links</label>
                      {isEditing && (
                        <Button size="sm" variant="outline" onClick={addPortfolioLink}>
                          <Plus size={14} className="mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {profileData.portfolioLinks.map((link, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate"
                          >
                            {link}
                          </a>
                          {isEditing && (
                            <button
                              onClick={() => removePortfolioLink(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      {profileData.portfolioLinks.length === 0 && (
                        <p className="text-gray-500 text-sm">No portfolio links added</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Portfolio</h2>
                  <Button icon={<Plus size={16} />}>
                    Add Project
                  </Button>
                </div>
                <div className="text-center py-12 text-gray-500">
                  <Briefcase size={48} className="mx-auto mb-4" />
                  <p>No portfolio items yet. Add your first project to showcase your work!</p>
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Earnings Overview</h2>
                <div className="text-center py-12 text-gray-500">
                  <DollarSign size={48} className="mx-auto mb-4" />
                  <p>Earnings data will be available once you complete projects.</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span>Email notifications for new messages</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span>Email notifications for project updates</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>SMS notifications</span>
                      </label>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span>Show profile in search results</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span>Allow direct contact from clients</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                    <div className="space-y-3">
                      <Button variant="outline">Change Password</Button>
                      <Button variant="outline">Download Account Data</Button>
                      <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                        Deactivate Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
