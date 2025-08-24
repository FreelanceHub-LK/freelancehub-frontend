"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Award, Plus, X, ArrowRight, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CertificatesStepProps {
  certificates: string[];
  onCertificatesChange: (certificates: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isLoading: boolean;
}

const POPULAR_CERTIFICATIONS = [
  "AWS Certified Solutions Architect",
  "Google Cloud Professional",
  "Microsoft Azure Fundamentals", 
  "Certified Kubernetes Administrator",
  "Project Management Professional (PMP)",
  "Certified ScrumMaster (CSM)",
  "Google Analytics Certified",
  "HubSpot Content Marketing",
  "Facebook Social Media Marketing",
  "Adobe Certified Expert (ACE)",
  "Salesforce Administrator",
  "CompTIA Security+"
];

export function CertificatesStep({ 
  certificates, 
  onCertificatesChange, 
  onNext, 
  onBack, 
  onSkip, 
  isLoading 
}: CertificatesStepProps) {
  const [certInput, setCertInput] = useState("");

  const handleCertAdd = (cert: string) => {
    const trimmedCert = cert.trim();
    if (trimmedCert && !certificates.includes(trimmedCert)) {
      onCertificatesChange([...certificates, trimmedCert]);
    }
    setCertInput("");
  };

  const handleCustomCertAdd = () => {
    if (certInput.trim()) {
      handleCertAdd(certInput);
    }
  };

  const handleCertRemove = (certToRemove: string) => {
    onCertificatesChange(certificates.filter(cert => cert !== certToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomCertAdd();
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
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Certifications & Credentials
          </h2>
          <p className="text-gray-600 text-lg">
            Showcase your professional certifications to build trust with clients
          </p>
        </div>

        {/* Certificate Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add your certifications
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., AWS Certified Solutions Architect"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Button
              onClick={handleCustomCertAdd}
              disabled={!certInput.trim()}
              className="bg-purple-600 hover:bg-purple-700 px-6"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Added Certificates */}
        {certificates.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Your Certifications ({certificates.length})
            </h3>
            <div className="space-y-2">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-900">{cert}</span>
                  </div>
                  <button
                    onClick={() => handleCertRemove(cert)}
                    className="text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Certifications */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Popular Certifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {POPULAR_CERTIFICATIONS.map((cert) => (
              <button
                key={cert}
                onClick={() => handleCertAdd(cert)}
                disabled={certificates.includes(cert)}
                className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                  certificates.includes(cert)
                    ? 'bg-purple-100 border-purple-300 text-purple-700 cursor-not-allowed'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{cert}</div>
                    {certificates.includes(cert) && (
                      <div className="text-xs text-purple-600 mt-1">✓ Added</div>
                    )}
                  </div>
                  {!certificates.includes(cert) && (
                    <Plus className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Helpful Tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <ExternalLink className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Pro Tip</h4>
              <p className="text-blue-800 text-sm">
                Include the issuing organization and year if possible. Clients trust verified credentials more than self-reported skills.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">
            {certificates.length === 0 
              ? "Certifications help you stand out (optional)" 
              : `You've added ${certificates.length} certification${certificates.length > 1 ? 's' : ''}`
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
              disabled={isLoading}
              isLoading={isLoading}
              className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
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
