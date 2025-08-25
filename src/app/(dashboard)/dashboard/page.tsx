"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  User, 
  Briefcase, 
  DollarSign, 
  Star, 
  Calendar,
  TrendingUp,
  FileText,
  Settings,
  Bell,
  Search,
  Plus,
  ArrowRight,
  Eye,
  MessageSquare,
  Award,
  Clock,
  Shield,
  X
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useAuth } from "@/hooks/useAuth";
import { freelancerApi } from "@/lib/api/freelancerApi";
import { passkeyApi } from "@/lib/api/registration";
import { toast } from "@/context/toast-context";

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalEarnings: number;
  monthlyEarnings: number;
  rating: number;
  reviewCount: number;
}

interface RecentProject {
  id: string;
  title: string;
  client: string;
  status: 'active' | 'pending' | 'completed';
  deadline: string;
  budget: number;
}

interface Notification {
  id: string;
  type: 'project' | 'message' | 'payment' | 'review';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth({ required: true });

  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
    rating: 0,
    reviewCount: 0
  });

  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [hasPasskeys, setHasPasskeys] = useState<boolean | null>(null);
  const [showPasskeyAlert, setShowPasskeyAlert] = useState(true);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      // Redirect freelancers to their specific dashboard
      if (user.role === 'freelancer') {
        router.push('/freelancer/dashboard');
        return;
      }
      
      setIsLoading(true);
      try {
        // Check for passkeys if user is a client
        if (user.role === 'client') {
          try {
            const userPasskeys = await passkeyApi.getUserPasskeys();
            setHasPasskeys(userPasskeys.length > 0);
          } catch (error) {
            console.error('Error checking passkeys:', error);
            setHasPasskeys(null);
          }
        }

        // Load freelancer profile if user is a freelancer
        if (user.role === 'freelancer') {
          const profile = await freelancerApi.getMyProfile();
          setProfileData(profile);
        }

        // TODO: Replace with real API calls based on user role
        // Mock data for now - replace with actual API endpoints
        setStats({
          totalProjects: user.role === 'freelancer' ? 12 : 5,
          activeProjects: user.role === 'freelancer' ? 3 : 2,
          completedProjects: user.role === 'freelancer' ? 9 : 3,
          totalEarnings: user.role === 'freelancer' ? 15750 : 8500,
          monthlyEarnings: user.role === 'freelancer' ? 2850 : 1200,
          rating: 4.8,
          reviewCount: user.role === 'freelancer' ? 24 : 8
        });

        setRecentProjects([
          {
            id: "1",
            title: "E-commerce Website Development",
            client: "TechStart Inc.",
            status: "active",
            deadline: "2025-09-15",
            budget: 2500
          },
          {
            id: "2", 
            title: "Mobile App UI Design",
            client: "Creative Agency",
            status: "pending",
            deadline: "2025-09-20",
            budget: 1800
          },
          {
            id: "3",
            title: "Logo Design & Branding",
            client: "Local Business",
            status: "completed",
            deadline: "2025-08-10",
            budget: 800
          }
        ]);

        setNotifications([
          {
            id: "1",
            type: "project",
            title: "New Project Invitation",
            message: "You've been invited to submit a proposal for 'React Dashboard Development'",
            time: "2 hours ago",
            read: false
          },
          {
            id: "2",
            type: "message",
            title: "New Message",
            message: "TechStart Inc. sent you a message about the e-commerce project",
            time: "4 hours ago",
            read: false
          },
          {
            id: "3",
            type: "payment",
            title: "Payment Received",
            message: "Payment of $800 has been received for Logo Design project",
            time: "1 day ago",
            read: true
          }
        ]);

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'project': return <Briefcase className="w-4 h-4" />;
      case 'message': return <MessageSquare className="w-4 h-4" />;
      case 'payment': return <DollarSign className="w-4 h-4" />;
      case 'review': return <Star className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="relative">
                <Bell className="w-4 h-4" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push("/profile")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white"
          >
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}! 👋
            </h2>
            <p className="text-green-100">
              You have {stats.activeProjects} active projects and {notifications.filter(n => !n.read).length} new notifications
            </p>
          </motion.div>
        </div>

        {/* Security Alert for Clients without Passkeys */}
        {user?.role === 'client' && hasPasskeys === false && showPasskeyAlert && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Alert className="bg-blue-50 border-blue-200">
              <div className="flex items-start justify-between">
                <div className="flex">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">
                      Secure your account with a passkey
                    </h4>
                    <p className="text-blue-700 text-sm mb-3">
                      Set up a passkey for faster, more secure sign-ins using your fingerprint, face, or device PIN.
                    </p>
                    <div className="flex items-center gap-3">
                      <Link href="/settings/security">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Shield className="w-4 h-4 mr-2" />
                          Set Up Passkey
                        </Button>
                      </Link>
                      <button
                        onClick={() => setShowPasskeyAlert(false)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Maybe later
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasskeyAlert(false)}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </Alert>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeProjects}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <div className="flex items-center">
                  <p className="text-3xl font-bold text-gray-900">{stats.rating}</p>
                  <Star className="w-5 h-5 text-yellow-400 ml-1" />
                </div>
                <p className="text-xs text-gray-500">({stats.reviewCount} reviews)</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push("/projects")}
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{project.title}</h4>
                        <p className="text-sm text-gray-500">Client: {project.client}</p>
                        <p className="text-sm text-gray-500">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                        <p className="text-sm font-medium text-gray-900 mt-1">${project.budget}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {recentProjects.length === 0 && (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No projects yet</p>
                    <Button className="mt-4" onClick={() => router.push("/projects/browse")}>
                      <Search className="w-4 h-4 mr-2" />
                      Browse Projects
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Notifications & Quick Actions */}
          <div className="space-y-6">
            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-lg shadow"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className={`p-3 rounded-lg border ${
                        notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {notifications.length === 0 && (
                  <div className="text-center py-4">
                    <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No notifications</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-lg shadow"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <Button 
                    fullWidth 
                    className="justify-start"
                    onClick={() => router.push("/projects/browse")}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Browse Projects
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => router.push("/proposals")}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    My Proposals
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => router.push("/profile/edit")}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
