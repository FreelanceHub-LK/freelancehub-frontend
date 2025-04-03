"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Phone,
  MapPin,
  FileText,
  Tag,
  Upload,
  Plus,
  X,
  Check,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Skills list for selection
const AVAILABLE_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "PHP",
  "HTML/CSS",
  "UI/UX Design",
  "Angular",
  "Vue.js",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "AWS",
  "Azure",
  "DevOps",
  "SEO",
  "Content Writing",
  "Graphic Design",
  "WordPress",
  "Laravel",
  "Mobile Development",
  "Data Analysis",
  "Machine Learning",
  "Digital Marketing",
];

export default function FreelancerProfileSetup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null,
  );
  const [skillInput, setSkillInput] = useState("");
  const [filteredSkills, setFilteredSkills] = useState<string[]>([]);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phoneNumber: "",
      location: "",
      bio: "",
      skills: [],
    },
  });

  const skills = watch("skills");

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setProfilePictureUrl(URL.createObjectURL(file));
    }
  };

  const filterSkills = (input: string) => {
    if (input.trim() === "") {
      setFilteredSkills([]);
      return;
    }

    const filtered = AVAILABLE_SKILLS.filter(
      (skill) =>
        skill.toLowerCase().includes(input.toLowerCase()) &&
        !skills.includes(skill),
    );
    setFilteredSkills(filtered);
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSkillInput(input);
    filterSkills(input);
    setShowSkillsDropdown(true);
  };

  const addSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setValue("skills", [...skills, skill]);
    }
    setSkillInput("");
    setFilteredSkills([]);
    setShowSkillsDropdown(false);
  };

  const addCustomSkill = () => {
    if (skillInput.trim() !== "" && !skills.includes(skillInput)) {
      setValue("skills", [...skills, skillInput.trim()]);
      setSkillInput("");
      setFilteredSkills([]);
    }
  };

  const removeSkill = (skill: string) => {
    setValue(
      "skills",
      skills.filter((s) => s !== skill),
    );
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    setErrorMessage("");

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("location", data.location);
    formData.append("bio", data.bio);
    data.skills.forEach((skill, index) => {
      formData.append(`skills[${index}]`, skill);
    });

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const response = await fetch("/api/freelancer/profile", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile");
      }

      // Redirect to freelancer dashboard
      router.push("/dashboard/freelancer");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 overflow-y-auto">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete your freelancer profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Let clients know about your skills and expertise
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {errorMessage}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profile Picture
                </label>
                <div className="mt-2 flex flex-col items-center">
                  <div className="relative h-24 w-24 mb-3">
                    {profilePictureUrl ? (
                      <Image
                        src={profilePictureUrl}
                        alt="Profile preview"
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profile-upload"
                    className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Upload photo
                  </label>
                  <input
                    id="profile-upload"
                    name="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="sr-only"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF up to 2MB
                  </p>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phoneNumber"
                    type="tel"
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.phoneNumber ? "border-red-300" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="+94 77 123 4567"
                    {...register("phoneNumber")}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="location"
                    type="text"
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.location ? "border-red-300" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="Colombo, Sri Lanka"
                    {...register("location")}
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bio
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-2 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="bio"
                    rows={4}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.bio ? "border-red-300" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="Tell clients about your experience, skills, and expertise..."
                    {...register("bio")}
                  />
                </div>
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.bio.message}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div>
                <label
                  htmlFor="skills"
                  className="block text-sm font-medium text-gray-700"
                >
                  Skills
                </label>
                <div className="mt-1 relative">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full flex items-center"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 text-green-600 hover:text-green-800 focus:outline-none"
                          title="Remove skill"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove skill</span>
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={handleSkillInputChange}
                        onFocus={() => {
                          if (skillInput) setShowSkillsDropdown(true);
                        }}
                        onBlur={() => {
                          // Delay hiding to allow for click events
                          setTimeout(() => setShowSkillsDropdown(false), 200);
                        }}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          errors.skills ? "border-red-300" : "border-gray-300"
                        } rounded-l-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                        placeholder="Add skills..."
                      />
                      <button
                        type="button"
                        title="Add custom skill"
                        onClick={addCustomSkill}
                        className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 rounded-r-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>

                    {showSkillsDropdown && filteredSkills.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto">
                        {filteredSkills.map((skill) => (
                          <div
                            key={skill}
                            onClick={() => addSkill(skill)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          >
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            {skill}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.skills && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.skills.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Type to search or add your own custom skills
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving profile..." : "Complete profile"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-xs text-gray-500">
              You can always update your profile information later from your
              account settings.
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/api/placeholder/800/1200"
          alt="Freelancer at work"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-12">
          <h2 className="text-white text-3xl font-bold mb-4">
            Start your freelance journey today
          </h2>
          <p className="text-white text-lg mb-6">
            Connect with clients worldwide and showcase your professional skills
          </p>
          <div className="flex space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex-1">
              <p className="text-white font-bold text-2xl">5000+</p>
              <p className="text-white/80 text-sm">Active clients</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex-1">
              <p className="text-white font-bold text-2xl">95%</p>
              <p className="text-white/80 text-sm">Success rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
