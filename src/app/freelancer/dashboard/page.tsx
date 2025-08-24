"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Briefcase, 
  Star, 
  DollarSign, 
  TrendingUp, 
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function FreelancerDashboardPage() {
  const { user, logout } = useAuth({ required: true });
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Redirect if not freelancer
  useEffect(() => {
    if (user && user.role !== 'freelancer') {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const stats = [
    {
      title: "Active Projects",
      value: "0",
      icon: Briefcase,
      color: "bg-blue-100 text-blue-600",
      change: "+0%"
    },
    {
      title: "Total Earnings",
      value: "LKR 0",
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
      change: "+0%"
    },
    {
      title: "Profile Views",
      value: "0",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
      change: "+0%"
    },
    {
      title: "Average Rating",
      value: "0.0",
      icon: Star,
      color: "bg-yellow-100 text-yellow-600",
      change: "New"
    }
  ];

  const navigationItems = [
    { name: "Dashboard", icon: Briefcase, active: true },
    { name: "Projects", icon: Briefcase },
    { name: "Proposals", icon: Plus },
    { name: "Messages", icon: Bell },
    { name: "Profile", icon: User },
    { name: "Settings", icon: Settings },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">FH</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FreelanceHub</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Hello, {user.name?.split(' ')[0] || user.name}! 👋
                </p>
                <p className="text-sm text-gray-500">Welcome back</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    item.active
                      ? 'bg-green-100 text-green-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Find Projects
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white mb-8"
          >
            <h2 className="text-3xl font-bold mb-2">
              Welcome to your freelancer journey! 🚀
            </h2>
            <p className="text-green-100 text-lg">
              You're all set up and ready to find amazing projects. Let's start building your freelance career!
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-600">{stat.title}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Getting Started */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-700">Complete profile setup</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">2</span>
                    </div>
                    <span className="text-gray-700">Browse available projects</span>
                  </div>
                  <Button size="sm" variant="outline">Browse</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">3</span>
                    </div>
                    <span className="text-gray-700">Submit your first proposal</span>
                  </div>
                  <Button size="sm" variant="outline">Learn How</Button>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">No activity yet</p>
                <p className="text-sm text-gray-400">
                  Your recent project activities will appear here once you start applying to projects.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Freelance Journey?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Explore thousands of projects posted by clients looking for talented freelancers like you. 
              Apply to projects that match your skills and start building your reputation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-green-600 hover:bg-green-700 px-8 py-3">
                <Search className="w-5 h-5 mr-2" />
                Browse Projects
              </Button>
              <Button variant="outline" className="px-8 py-3">
                <User className="w-5 h-5 mr-2" />
                Complete Profile
              </Button>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
