"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Plus, X, ArrowRight, ArrowLeft, ExternalLink, Globe, Github } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PortfolioStepProps {
  portfolioLinks: string[];
  onPortfolioChange: (portfolioLinks: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isLoading: boolean;
}

const PORTFOLIO_EXAMPLES = [
  { 
    type: 'Website', 
    icon: Globe, 
    example: 'https://your-website.com',
    description: 'Your personal website or portfolio'
  },
  { 
    type: 'GitHub', 
    icon: Github, 
    example: 'https://github.com/yourusername',
    description: 'Code repositories and projects'
  },
  { 
    type: 'Behance', 
    icon: ExternalLink, 
    example: 'https://behance.net/yourusername',
    description: 'Design portfolio and creative work'
  },
  { 
    type: 'Dribbble', 
    icon: ExternalLink, 
    example: 'https://dribbble.com/yourusername',
    description: 'Design shots and inspiration'
  },
  { 
    type: 'LinkedIn', 
    icon: ExternalLink, 
    example: 'https://linkedin.com/in/yourusername',
    description: 'Professional profile and experience'
  }
];

export function PortfolioStep({ 
  portfolioLinks, 
  onPortfolioChange, 
  onNext, 
  onBack, 
  onSkip, 
  isLoading 
}: PortfolioStepProps) {
  const [linkInput, setLinkInput] = useState("");

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleLinkAdd = (link: string) => {
    const trimmedLink = link.trim();
    
    // Add https:// if no protocol is specified
    let processedLink = trimmedLink;
    if (trimmedLink && !trimmedLink.startsWith('http://') && !trimmedLink.startsWith('https://')) {
      processedLink = 'https://' + trimmedLink;
    }
    
    if (processedLink && isValidUrl(processedLink) && !portfolioLinks.includes(processedLink)) {
      onPortfolioChange([...portfolioLinks, processedLink]);
    }
    setLinkInput("");
  };

  const handleCustomLinkAdd = () => {
    if (linkInput.trim()) {
      handleLinkAdd(linkInput);
    }
  };

  const handleLinkRemove = (linkToRemove: string) => {
    onPortfolioChange(portfolioLinks.filter(link => link !== linkToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomLinkAdd();
    }
  };

  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
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
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Portfolio & Work Samples
          </h2>
          <p className="text-gray-600 text-lg">
            Share links to your best work to showcase your capabilities
          </p>
        </div>

        {/* Link Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add portfolio links
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://your-portfolio.com or github.com/username"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              onClick={handleCustomLinkAdd}
              disabled={!linkInput.trim()}
              className="bg-blue-600 hover:bg-blue-700 px-6"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            We'll automatically add https:// if you don't include it
          </p>
        </div>

        {/* Added Portfolio Links */}
        {portfolioLinks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Your Portfolio Links ({portfolioLinks.length})
            </h3>
            <div className="space-y-3">
              {portfolioLinks.map((link, index) => (
                <motion.div
                  key={link}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <ExternalLink className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {getDomainFromUrl(link)}
                      </div>
                      <a 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 break-all"
                      >
                        {link}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Open link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleLinkRemove(link)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full p-1"
                      title="Remove link"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Popular Portfolio Platforms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PORTFOLIO_EXAMPLES.map((platform) => {
              const Icon = platform.icon;
              return (
                <div
                  key={platform.type}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{platform.type}</h4>
                      <p className="text-sm text-gray-600 mb-2">{platform.description}</p>
                      <code className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {platform.example}
                      </code>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Helpful Tip */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Briefcase className="w-3 h-3 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-green-900 mb-1">Portfolio Tips</h4>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Include 3-5 of your best projects</li>
                <li>• Make sure your links are public and accessible</li>
                <li>• Add descriptions explaining your role in each project</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">
            {portfolioLinks.length === 0 
              ? "Portfolio links help clients see your work (optional)" 
              : `You've added ${portfolioLinks.length} portfolio link${portfolioLinks.length > 1 ? 's' : ''}`
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
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
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
