"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, 
  Briefcase, 
  DollarSign, 
  Star, 
  Plus, 
  X, 
  ArrowRight,
  CheckCircle,
  Shield,
  Fingerprint,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { freelancerApi } from "@/lib/api/freelancerApi";
import { skillsApi, Skill } from "@/lib/api/skills";
import { PasskeySetup } from "@/components/auth/PasskeySetup";
import { toast } from "@/context/toast-context";

interface FreelancerProfileData {
  skills: string[];
  hourlyRate?: number;
  education?: string;
  isAvailable: boolean;
  certifications: string[];
  portfolioLinks: string[];
}

const PREDEFINED_SKILLS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", 
  "Django", "Flask", "PHP", "Laravel", "Java", "Spring Boot", "C#", 
  ".NET", "Ruby", "Rails", "Go", "Rust", "Swift", "Kotlin", "Flutter", 
  "React Native", "Vue.js", "Angular", "HTML", "CSS", "SASS", "Tailwind CSS",
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "AWS", "Azure", "GCP", 
  "Docker", "Kubernetes", "GraphQL", "REST API", "UI/UX Design", 
  "Figma", "Adobe Creative Suite", "Content Writing", "SEO", "Digital Marketing"
];

export default function FreelancerSetupPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth({ required: true });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [certificationInput, setCertificationInput] = useState("");
  const [portfolioInput, setPortfolioInput] = useState("");
  
  // Backend data states
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillSearchResults, setSkillSearchResults] = useState<Skill[]>([]);

  const [profileData, setProfileData] = useState<FreelancerProfileData>({
    skills: [],
    hourlyRate: undefined,
    education: "",
    isAvailable: true,
    certifications: [],
    portfolioLinks: [],
  });

  const totalSteps = 6; // Updated to include completion step

  // Load popular skills from backend on component mount
  useEffect(() => {
    const loadSkills = async () => {
      setSkillsLoading(true);
      try {
        const popularSkills = await skillsApi.getPopularSkills(50); // Get top 50 popular skills
        setAvailableSkills(popularSkills);
      } catch (error) {
        console.error("Failed to load skills:", error);
        // Fallback to predefined skills if API fails
        const fallbackSkills: Skill[] = PREDEFINED_SKILLS.map((skill, index) => ({
          _id: `fallback-${index}`,
          name: skill,
          popularity: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
        setAvailableSkills(fallbackSkills);
      } finally {
        setSkillsLoading(false);
      }
    };

    loadSkills();
  }, []);

  // Search skills when user types
  useEffect(() => {
    const searchSkills = async () => {
      if (skillInput.trim().length > 2) {
        try {
          const results = await skillsApi.searchSkills(skillInput.trim());
          setSkillSearchResults(results);
        } catch (error) {
          console.error("Failed to search skills:", error);
          setSkillSearchResults([]);
        }
      } else {
        setSkillSearchResults([]);
      }
    };

    const timeoutId = setTimeout(searchSkills, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [skillInput]);

  const handleSkillAdd = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !profileData.skills.includes(trimmedSkill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill]
      }));
    }
    setSkillInput("");
    setSkillSearchResults([]);
  };

  const handleCustomSkillAdd = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !profileData.skills.includes(trimmedSkill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill]
      }));
      setSkillInput("");
      setSkillSearchResults([]);
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleCertificationAdd = () => {
    const trimmedCert = certificationInput.trim();
    if (trimmedCert && !profileData.certifications.includes(trimmedCert)) {
      setProfileData(prev => ({
        ...prev,
        certifications: [...prev.certifications, trimmedCert]
      }));
      setCertificationInput("");
    }
  };

  const handleCertificationRemove = (certToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  const handlePortfolioAdd = () => {
    const trimmedUrl = portfolioInput.trim();
    if (trimmedUrl && !profileData.portfolioLinks.includes(trimmedUrl)) {
      setProfileData(prev => ({
        ...prev,
        portfolioLinks: [...prev.portfolioLinks, trimmedUrl]
      }));
      setPortfolioInput("");
    }
  };

  const handlePortfolioRemove = (urlToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.filter(url => url !== urlToRemove)
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedStep1 = profileData.skills.length > 0;
  const canProceedStep2 = profileData.hourlyRate && profileData.hourlyRate > 0;
  const canProceedStep3 = profileData.education?.trim();

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Create freelancer profile
      const freelancerData = {
        userId: user?.id,
        ...profileData,
      };

      await freelancerApi.create(freelancerData);
      
      toast.success("Your freelancer profile has been created successfully!");
      
      // Navigate to completion screen
      setCurrentStep(6); // New completion step
    } catch (error: any) {
      console.error("Profile creation error:", error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipToLater = () => {
    // For now, just redirect to dashboard
    // Later you can implement a way to complete the profile
    router.push("/dashboard");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Freelancer Profile
          </h1>
          <p className="text-gray-600">
            Help clients understand your expertise and find the perfect projects
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {Math.min(currentStep, 5)} of 5
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((Math.min(currentStep, 5) / 5) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(Math.min(currentStep, 5) / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Steps */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          {/* Step 1: Skills */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Your Skills</h3>
                  <p className="text-gray-600">Add the skills that showcase your expertise</p>
                </div>
              </div>

              {/* Skill Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Skills
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleCustomSkillAdd()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Type a skill (e.g., JavaScript, Python, UI Design)"
                    />
                    
                    {/* Search Results Dropdown */}
                    {skillInput.trim().length > 2 && skillSearchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {skillSearchResults.map((skill) => (
                          <button
                            key={skill._id}
                            onClick={() => handleSkillAdd(skill.name)}
                            disabled={profileData.skills.includes(skill.name)}
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                              profileData.skills.includes(skill.name)
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{skill.name}</span>
                              {skill.category && (
                                <span className="text-xs text-gray-500">{skill.category}</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={handleCustomSkillAdd}
                    disabled={!skillInput.trim()}
                    className="px-4 py-2"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Start typing to search existing skills or add your own custom skill
                </p>
              </div>

              {/* Popular Skills from Backend */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Popular Skills:
                  {skillsLoading && <span className="text-xs text-gray-500 ml-2">Loading...</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.slice(0, 20).map((skill) => (
                    <button
                      key={skill._id}
                      onClick={() => handleSkillAdd(skill.name)}
                      disabled={profileData.skills.includes(skill.name)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        profileData.skills.includes(skill.name)
                          ? "bg-green-100 border-green-300 text-green-700 cursor-not-allowed"
                          : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
                      }`}
                    >
                      {skill.name}
                    </button>
                  ))}
                  
                  {!skillsLoading && availableSkills.length === 0 && (
                    <p className="text-sm text-gray-500">No skills available. You can add custom skills above.</p>
                  )}
                </div>
              </div>

              {/* Selected Skills */}
              {profileData.skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Your Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {skill}
                        <button
                          onClick={() => handleSkillRemove(skill)}
                          className="hover:text-green-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Hourly Rate */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Set Your Rate</h3>
                  <p className="text-gray-600">What's your hourly rate for projects?</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={profileData.hourlyRate || ""}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      hourlyRate: parseFloat(e.target.value) || undefined
                    }))}
                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Don't worry, you can always change this later. Consider your experience level and market rates.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Education & Experience */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Education & Experience</h3>
                  <p className="text-gray-600">Tell clients about your background</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education & Background
                </label>
                <textarea
                  value={profileData.education}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    education: e.target.value
                  }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe your educational background, work experience, and relevant qualifications..."
                />
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications (Optional)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={certificationInput}
                    onChange={(e) => setCertificationInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleCertificationAdd()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., AWS Certified Solutions Architect"
                  />
                  <Button
                    type="button"
                    onClick={handleCertificationAdd}
                    disabled={!certificationInput.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {profileData.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profileData.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {cert}
                        <button
                          onClick={() => handleCertificationRemove(cert)}
                          className="hover:text-blue-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Portfolio & Final Setup */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Portfolio & Final Details</h3>
                  <p className="text-gray-600">Showcase your work and set your availability</p>
                </div>
              </div>

              {/* Portfolio Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Links (Optional)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={portfolioInput}
                    onChange={(e) => setPortfolioInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handlePortfolioAdd()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://your-portfolio.com"
                  />
                  <Button
                    type="button"
                    onClick={handlePortfolioAdd}
                    disabled={!portfolioInput.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {profileData.portfolioLinks.length > 0 && (
                  <div className="space-y-2">
                    {profileData.portfolioLinks.map((url) => (
                      <div
                        key={url}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline truncate"
                        >
                          {url}
                        </a>
                        <button
                          onClick={() => handlePortfolioRemove(url)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability Status
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      checked={profileData.isAvailable}
                      onChange={() => setProfileData(prev => ({ ...prev, isAvailable: true }))}
                      className="mr-2"
                    />
                    <span className="text-green-600 font-medium">Available for work</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      checked={!profileData.isAvailable}
                      onChange={() => setProfileData(prev => ({ ...prev, isAvailable: false }))}
                      className="mr-2"
                    />
                    <span className="text-gray-600">Not available</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Security Setup (Passkey) */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Secure Your Account</h3>
                  <p className="text-gray-600">Add an extra layer of security with passkeys (optional)</p>
                </div>
              </div>

              <PasskeySetup
                onSetupPasskey={async (deviceName: string) => {
                  // The PasskeySetup component handles the passkey creation
                  toast.success("Passkey setup completed successfully!");
                  // Move to next step after successful passkey setup
                  setTimeout(() => {
                    handleNext();
                  }, 1500);
                }}
                onSkip={() => {
                  // Skip passkey setup and go to next step
                  handleNext();
                }}
                className="w-full"
              />
            </div>
          )}

          {/* Step 6: Completion */}
          {currentStep === 6 && (
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">🎉 All Set Up!</h3>
                <p className="text-lg text-gray-600">
                  Your freelancer profile has been created successfully!
                </p>
                <p className="text-gray-500">
                  You're ready to start finding amazing projects and connecting with clients.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                <h4 className="font-semibold text-green-800 mb-2">What's Next?</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Browse and apply to projects that match your skills</li>
                  <li>• Complete your profile with a professional photo</li>
                  <li>• Add portfolio samples to showcase your work</li>
                  <li>• Start building your reputation on FreelanceHub</li>
                </ul>
              </div>

              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          )}
        </motion.div>

        {/* Navigation - Only show if not on completion step */}
        {currentStep !== 6 && (
          <div className="flex justify-between items-center">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Back
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={handleSkipToLater}
                disabled={isLoading}
                className="text-gray-600"
              >
                Skip for now
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !canProceedStep1) ||
                    (currentStep === 2 && !canProceedStep2) ||
                    (currentStep === 3 && !canProceedStep3) ||
                    isLoading
                  }
                  className="bg-green-600 hover:bg-green-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Profile
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
