"use client";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { Calendar, DollarSign } from "lucide-react";

interface ProjectFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    budget: initialData?.budget || "",
    deadline: initialData?.deadline
      ? new Date(initialData.deadline).toISOString().split("T")[0]
      : "",
    skills: initialData?.skills?.join(", ") || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Process form data
    const processedData = {
      ...formData,
      budget: parseFloat(formData.budget),
      skills: formData.skills
        .split(",")
        .map((skill: string) => skill.trim())
        .filter(Boolean),
    };

    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Project Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
          placeholder="e.g., E-commerce Website Development"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Project Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
          placeholder="Describe your project in detail..."
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Select a category</option>
          <option value="web_development">Web Development</option>
          <option value="mobile_app">Mobile App Development</option>
          <option value="design">Design</option>
          <option value="content_writing">Content Writing</option>
          <option value="marketing">Marketing</option>
          <option value="data_entry">Data Entry</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="budget"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Budget (LKR)
          </label>
          <div className="relative">
            <DollarSign
              size={16}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
              min="0"
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your budget"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="deadline"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Deadline
          </label>
          <div className="relative">
            <Calendar
              size={16}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="skills"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Required Skills (comma separated)
        </label>
        <input
          type="text"
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
          placeholder="e.g., React, Node.js, MongoDB"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          className="mr-4"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
};
