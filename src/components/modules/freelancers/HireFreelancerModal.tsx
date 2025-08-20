"use client";
import React, { useState } from "react";
import { 
  X, 
  MessageCircle, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Clock, 
  FileText, 
  Paperclip,
  Send,
  Star,
  Shield,
  CheckCircle
} from "lucide-react";
import Button from "@/components/ui/Button";

interface HireFreelancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  freelancer: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    rating: number;
    hourlyRate: number;
    responseTime: string;
    completedProjects: number;
  };
}

type ContactType = 'message' | 'hire';
type ProjectType = 'hourly' | 'fixed';

export const HireFreelancerModal: React.FC<HireFreelancerModalProps> = ({
  isOpen,
  onClose,
  freelancer
}) => {
  const [contactType, setContactType] = useState<ContactType>('message');
  const [projectType, setProjectType] = useState<ProjectType>('hourly');
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    projectTitle: '',
    projectDescription: '',
    budget: '',
    duration: '',
    startDate: '',
    skills: '',
    attachments: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {contactType === 'message' ? 'Message Sent!' : 'Hire Request Sent!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {contactType === 'message' 
              ? `Your message has been sent to ${freelancer.name}. They typically respond within ${freelancer.responseTime}.`
              : `Your hire request has been sent to ${freelancer.name}. They will review your project details and respond soon.`
            }
          </p>
          <div className="space-y-3">
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  subject: '',
                  message: '',
                  projectTitle: '',
                  projectDescription: '',
                  budget: '',
                  duration: '',
                  startDate: '',
                  skills: '',
                  attachments: []
                });
              }}
              className="w-full text-blue-600 hover:text-blue-700 text-sm"
            >
              Send Another {contactType === 'message' ? 'Message' : 'Request'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={freelancer.avatar}
                alt={freelancer.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{freelancer.name}</h2>
                <p className="text-gray-600">{freelancer.title}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {renderStars(freelancer.rating)}
                  <span className="text-sm text-gray-500">
                    ({freelancer.completedProjects} projects completed)
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Contact Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setContactType('message')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                contactType === 'message'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageCircle size={16} />
              <span>Send Message</span>
            </button>
            <button
              onClick={() => setContactType('hire')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                contactType === 'hire'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Briefcase size={16} />
              <span>Hire for Project</span>
            </button>
          </div>

          {/* Freelancer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">${freelancer.hourlyRate}</div>
              <div className="text-sm text-gray-600">per hour</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{freelancer.responseTime}</div>
              <div className="text-sm text-gray-600">response time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{freelancer.completedProjects}</div>
              <div className="text-sm text-gray-600">projects completed</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {contactType === 'message' ? (
              // Message Form
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell them about your project or ask any questions..."
                    required
                  />
                </div>
              </>
            ) : (
              // Hire Form
              <>
                {/* Project Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Project Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setProjectType('hourly')}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        projectType === 'hourly'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock size={20} className="text-blue-600" />
                        <span className="font-medium">Hourly Project</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Pay for hours worked on your project
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProjectType('fixed')}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        projectType === 'fixed'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign size={20} className="text-green-600" />
                        <span className="font-medium">Fixed Price</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Set a fixed budget for your project
                      </p>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={formData.projectTitle}
                      onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="What do you need done?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget {projectType === 'hourly' ? '(per hour)' : '(total)'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={projectType === 'hourly' ? freelancer.hourlyRate.toString() : '1000'}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Duration
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select duration</option>
                      <option value="1-7 days">1-7 days</option>
                      <option value="1-2 weeks">1-2 weeks</option>
                      <option value="1 month">1 month</option>
                      <option value="2-3 months">2-3 months</option>
                      <option value="3+ months">3+ months</option>
                      <option value="ongoing">Ongoing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description
                  </label>
                  <textarea
                    value={formData.projectDescription}
                    onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your project in detail..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills
                  </label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                </div>
              </>
            )}

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Paperclip size={24} className="mx-auto text-gray-400 mb-2" />
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    Click to upload files
                  </span>
                  <span className="text-gray-500"> or drag and drop</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  PDF, DOC, TXT, JPG, PNG up to 10MB each
                </p>
              </div>

              {formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Security Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Secure Transaction</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your payment is protected by our escrow system. Funds are only released when you're satisfied with the work.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={16} />
                    <span>
                      {contactType === 'message' ? 'Send Message' : 'Send Hire Request'}
                    </span>
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
