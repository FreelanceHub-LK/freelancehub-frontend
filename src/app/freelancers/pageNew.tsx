"use client";
import React, { useState, useEffect } from "react";
import { FreelancerFilters as FreelancerFiltersNew } from "@/components/modules/freelancers/FreelancerFiltersNew";
import { FreelancerCard } from "@/components/modules/freelancers/FreelancerCard";
import { useFreelancers, useFreelancerSearch } from "@/hooks/useFreelancers";
import { FreelancerFilters } from "@/lib/api/freelancer";
import { Search, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function FreelancersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  
  const {
    freelancers,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    loadMore,
    refresh
  } = useFreelancers();

  const {
    results: searchResults,
    loading: searchLoading,
    search,
    clearResults
  } = useFreelancerSearch();

  const handleApplyFilters = (newFilters: FreelancerFilters) => {
    updateFilters(newFilters);
    if (searchQuery) {
      clearResults();
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      search(searchQuery, filters);
      setShowSearch(true);
    } else {
      clearResults();
      setShowSearch(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    clearResults();
    setShowSearch(false);
    refresh();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const displayedFreelancers = showSearch ? searchResults : freelancers;
  const isLoading = showSearch ? searchLoading : loading;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Talented Freelancers</h1>
        <p className="text-gray-600 mb-6">
          Discover skilled professionals for your projects. Browse through our verified freelancers
          and find the perfect match for your needs.
        </p>

        {/* Search Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search freelancers by name, skills, or location..."
                className="w-full p-3 pr-10 border border-gray-300 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
            <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
              Search
            </Button>
            {showSearch && (
              <Button variant="outline" onClick={handleClearSearch}>
                Clear
              </Button>
            )}
          </div>
          
          {showSearch && (
            <div className="mt-2 text-sm text-gray-600">
              Showing search results for "{searchQuery}" ({searchResults.length} found)
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <FreelancerFiltersNew onApplyFilters={handleApplyFilters} initialFilters={filters} />

      {/* Results Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">
              {showSearch ? 'Search Results' : 'Available Freelancers'}
            </h2>
            {!showSearch && (
              <p className="text-gray-600">
                Showing {freelancers.length} of {pagination.total} freelancers
                {filters.skills?.length ? ` with skills: ${filters.skills.join(', ')}` : ''}
              </p>
            )}
          </div>
          
          {!showSearch && freelancers.length > 0 && (
            <Button variant="outline" onClick={refresh} size="sm">
              Refresh
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin mr-2" size={24} />
            <span>Loading freelancers...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <Button variant="outline" onClick={refresh} className="mt-2" size="sm">
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && displayedFreelancers.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <Search className="mx-auto text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {showSearch ? 'No freelancers found' : 'No freelancers available'}
            </h3>
            <p className="text-gray-600 mb-4">
              {showSearch 
                ? 'Try adjusting your search terms or filters to find more results.'
                : 'There are currently no freelancers matching your criteria.'
              }
            </p>
            {showSearch && (
              <Button onClick={handleClearSearch}>
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* Freelancers Grid */}
        {!isLoading && displayedFreelancers.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6">
              {displayedFreelancers.map((freelancer) => (
                <FreelancerCard
                  key={freelancer._id}
                  id={freelancer._id}
                  name={`${freelancer.firstName} ${freelancer.lastName}`}
                  title={freelancer.bio || "Freelancer"}
                  hourlyRate={freelancer.hourlyRate || 0}
                  rating={freelancer.rating}
                  reviews={freelancer.reviewCount}
                  skills={freelancer.skills || []}
                  location={freelancer.address || "Location not specified"}
                  about={freelancer.bio || "No description available"}
                  imageUrl={freelancer.profilePicture || "/api/placeholder/64/64"}
                  completedProjects={freelancer.completedProjects || 0}
                />
              ))}
            </div>

            {/* Load More Button */}
            {!showSearch && pagination.page < pagination.totalPages && (
              <div className="text-center mt-8">
                <Button onClick={loadMore} variant="outline">
                  Load More Freelancers
                </Button>
              </div>
            )}

            {/* Pagination Info */}
            {!showSearch && (
              <div className="text-center mt-4 text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </div>
            )}
          </>
        )}
      </div>

      {/* Stats Section */}
      {!showSearch && !isLoading && freelancers.length > 0 && (
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Platform Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{pagination.total}+</div>
              <div className="text-gray-600">Active Freelancers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {freelancers.reduce((acc, f) => acc + (f.completedProjects || 0), 0)}+
              </div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {freelancers.length > 0 
                  ? (freelancers.reduce((acc, f) => acc + f.rating, 0) / freelancers.length).toFixed(1)
                  : '0'
                }
              </div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
