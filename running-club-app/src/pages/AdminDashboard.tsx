import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Run } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff,
  Filter,
  Search,
  BarChart3,
  UserPlus,
  Activity
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'events'>('overview');
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [usersResponse, runsResponse] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/runs')
      ]);
      
      const usersData = await usersResponse.json();
      const runsData = await runsResponse.json();
      
      setUsers(usersData);
      setRuns(runsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    // In a real app, you'd update the user's approval status
    console.log('Approving user:', userId);
  };

  const handleDeleteUser = async (userId: string) => {
    // In a real app, you'd delete the user
    console.log('Deleting user:', userId);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await fetch(`/api/runs/${eventId}`, { method: 'DELETE' });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const stats = {
    totalUsers: users.length,
    totalEvents: runs.length,
    activeUsers: users.filter(u => u.totalRuns > 0).length,
    totalDistance: users.reduce((sum, u) => sum + u.totalDistance, 0),
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your running community</p>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'users', name: 'Users', icon: Users },
            { id: 'events', name: 'Events', icon: Calendar },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Users</p>
                      <p className="text-2xl font-bold text-primary-600">{stats.totalUsers}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary-600" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Events</p>
                      <p className="text-2xl font-bold text-secondary-600">{stats.totalEvents}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-secondary-600" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="card"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Users</p>
                      <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
                    </div>
                    <Activity className="w-8 h-8 text-green-600" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="card"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Distance</p>
                      <p className="text-2xl font-bold text-gray-600">{stats.totalDistance}km</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-gray-600" />
                  </div>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {runs.slice(0, 5).map((run) => (
                    <div key={run.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{run.title}</p>
                        <p className="text-sm text-gray-600">{run.participants.length} participants</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        run.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        run.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {run.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Search */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite User
                </motion.button>
              </div>

              {/* Users Table */}
              <div className="card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Runs</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Distance</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-8 h-8 rounded-full mr-3"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-900">{user.totalRuns}</td>
                          <td className="py-3 px-4 text-gray-900">{user.totalDistance}km</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedUser(user)}
                                className="p-1 text-gray-400 hover:text-blue-600"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleApproveUser(user.id)}
                                className="p-1 text-gray-400 hover:text-green-600"
                              >
                                <Check className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-1 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Manage Events</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateEvent(true)}
                  className="btn-primary flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </motion.button>
              </div>

              {/* Events Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {runs.map((run) => (
                  <motion.div
                    key={run.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{run.title}</h3>
                        <p className="text-sm text-gray-600">{run.location}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        run.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        run.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {run.difficulty}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary-600">{run.distance}km</div>
                        <div className="text-xs text-gray-500">Distance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-secondary-600">{run.pace}</div>
                        <div className="text-xs text-gray-500">Pace</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-600">{run.participants.length}/{run.maxParticipants}</div>
                        <div className="text-xs text-gray-500">Runners</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-gray-400 hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteEvent(run.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{selectedUser.name}</h3>
                <p className="text-gray-600">{selectedUser.email}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">{selectedUser.totalRuns}</div>
                    <div className="text-sm text-gray-500">Total Runs</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-secondary-600">{selectedUser.totalDistance}km</div>
                    <div className="text-sm text-gray-500">Total Distance</div>
                  </div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900 mb-2">Badges</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {selectedUser.badges.map((badge) => (
                      <span
                        key={badge}
                        className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedUser(null)}
                  className="btn-secondary"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;