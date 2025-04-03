import React from "react";
import Image from "next/image";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface FreelancerPortfolioProps {
  portfolio: PortfolioItem[];
}

export const FreelancerPortfolio: React.FC<FreelancerPortfolioProps> = ({
  portfolio,
}) => {
  if (!portfolio || portfolio.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
        <p className="text-gray-500 italic">No portfolio items available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Portfolio</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolio.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="relative h-48 w-full">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
