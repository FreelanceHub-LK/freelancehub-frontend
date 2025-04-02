"use client";
import React from 'react';
import StatCard from '../../components/shared/start-card/StatCard';
import { 
  freelancerProfile, 
  activeProjects, 
  earningsData, 
  activityFeed 
} from '../../../types/freelancerDummyData';
import { 
  Briefcase, 
  DollarSign, 
  Star, 
  Activity as ActivityIcon 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const FreelancerDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-50">
      {/* Profile Header */}
      <div className="flex items-center mb-6 bg-white p-6 rounded-lg shadow">
        <img 
          src={freelancerProfile.avatar} 
          alt={freelancerProfile.name} 
          className="w-24 h-24 rounded-full mr-6"
        />
        <div>
          <h1 className="text-3xl font-bold">{freelancerProfile.name}</h1>
          <div className="flex items-center mt-2">
            <Star className="text-yellow-500 mr-2" fill="currentColor" />
            <span className="text-lg">{freelancerProfile.rating} / 5.0</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="Total Earnings" 
          value={`$${freelancerProfile.totalEarnings}`} 
          icon={<DollarSign size={32} />}
          variant="success"
          change={15}
        />
        <StatCard 
          title="Completed Projects" 
          value={freelancerProfile.completedProjects} 
          icon={<Briefcase size={32} />}
          variant="primary"
          change={10}
        />
        <StatCard 
          title="Active Projects" 
          value={activeProjects.length} 
          icon={<ActivityIcon size={32} />}
          variant="secondary"
          change={-5}
        />
      </div>

      {/* Skills Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {freelancerProfile.skills.map((skill) => (
            <div key={skill.name} className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium">{skill.name}</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                 
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {skill.endorsements} endorsements
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Monthly Earnings</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={earningsData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#8884d8" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        {activityFeed.map((activity) => (
          <div 
            key={activity.id} 
            className="border-b last:border-b-0 py-3 flex items-center"
          >
            <div className="mr-4">
              {activity.type === 'project' && <Briefcase className="text-blue-500" />}
              {activity.type === 'payment' && <DollarSign className="text-green-500" />}
            </div>
            <div>
              <p className="font-medium">{activity.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreelancerDashboard;