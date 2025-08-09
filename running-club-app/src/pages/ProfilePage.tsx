import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Calendar,
  MapPin,
  Clock,
  Users,
  Settings,
  Edit
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Sample data for charts
  const weeklyData = [
    { week: 'Week 1', distance: 25, runs: 4 },
    { week: 'Week 2', distance: 32, runs: 5 },
    { week: 'Week 3', distance: 28, runs: 4 },
    { week: 'Week 4', distance: 35, runs: 6 },
    { week: 'Week 5', distance: 30, runs: 5 },
    { week: 'Week 6', distance: 38, runs: 6 },
    { week: 'Week 7', distance: 42, runs: 7 },
  ];

  const paceData = [
    { month: 'Jan', pace: 6.2 },
    { month: 'Feb', pace: 6.0 },
    { month: 'Mar', pace: 5.8 },
    { month: 'Apr', pace: 5.6 },
    { month: 'May', pace: 5.4 },
    { month: 'Jun', pace: 5.2 },
  ];

  const badgeData = [
    { name: 'Marathon', value: 1, color: '#3B82F6' },
    { name: 'Half Marathon', value: 3, color: '#10B981' },
    { name: '10K', value: 8, color: '#F59E0B' },
    { name: '5K', value: 15, color: '#EF4444' },
  ];

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'marathon': return '🏃‍♀️';
      case 'half-marathon': return '🏃‍♂️';
      case '10k': return '🎯';
      case '5k': return '⚡';
      case 'ultra': return '🏔️';
      case 'trail-runner': return '🌲';
      case 'speed-demon': return '💨';
      case 'consistency': return '📈';
      case 'early-bird': return '🌅';
      case 'streak': return '🔥';
      case 'mentor': return '👨‍🏫';
      case 'social-butterfly': return '🦋';
      case 'nutrition-expert': return '🥗';
      case 'morning-person': return '☀️';
      case 'weekend-warrior': return '⚔️';
      case 'newbie': return '🌱';
      case 'beginner': return '🌱';
      default: return '🏆';
    }
  };

  const getBadgeName = (badge: string) => {
    return badge.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleSave = () => {
    // In a real app, you'd save to the backend
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
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
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card mb-6"
            >
              <div className="text-center">
                <motion.img
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary-100"
                />
                
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="input-field text-center text-lg font-semibold"
                    />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="input-field text-center"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="btn-primary w-full"
                    >
                      Save Changes
                    </motion.button>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h2>
                    <p className="text-gray-600 mb-4">{user.email}</p>
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <Trophy className="w-4 h-4 mr-1" />
                      {user.role === 'admin' ? 'Admin' : 'Runner'}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Runs</p>
                    <p className="text-2xl font-bold text-primary-600">{user.totalRuns}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary-600" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Distance</p>
                    <p className="text-2xl font-bold text-secondary-600">{user.totalDistance}km</p>
                  </div>
                  <MapPin className="w-8 h-8 text-secondary-600" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Average Pace</p>
                    <p className="text-2xl font-bold text-gray-600">{user.avgPace}/km</p>
                  </div>
                  <Clock className="w-8 h-8 text-gray-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts and Badges */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Progress Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="distance" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Pace Improvement Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pace Improvement</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={paceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="pace" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {user.badges.map((badge, index) => (
                  <motion.div
                    key={badge}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="text-center p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg border border-primary-100"
                  >
                    <div className="text-3xl mb-2">{getBadgeIcon(badge)}</div>
                    <p className="text-sm font-medium text-gray-900">{getBadgeName(badge)}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Badge Distribution Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Badge Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={badgeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {badgeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;