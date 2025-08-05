import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Calendar, 
  MapPin, 
  Clock, 
  Trophy, 
  TrendingUp,
  Edit3,
  Camera,
  Award,
  Target,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Mock data for charts
  const weeklyRunsData = [
    { day: 'Mon', distance: 5.2, runs: 1 },
    { day: 'Tue', distance: 0, runs: 0 },
    { day: 'Wed', distance: 8.1, runs: 1 },
    { day: 'Thu', distance: 3.5, runs: 1 },
    { day: 'Fri', distance: 0, runs: 0 },
    { day: 'Sat', distance: 12.3, runs: 1 },
    { day: 'Sun', distance: 6.8, runs: 1 },
  ];

  const monthlyProgressData = [
    { month: 'Jan', distance: 85, pace: 5.2 },
    { month: 'Feb', distance: 92, pace: 5.0 },
    { month: 'Mar', distance: 78, pace: 5.1 },
    { month: 'Apr', distance: 105, pace: 4.8 },
    { month: 'May', distance: 118, pace: 4.7 },
    { month: 'Jun', distance: 95, pace: 4.9 },
  ];

  const runTypeData = [
    { name: 'Easy Runs', value: 45, color: '#22c55e' },
    { name: 'Tempo Runs', value: 25, color: '#f59e0b' },
    { name: 'Long Runs', value: 20, color: '#3b82f6' },
    { name: 'Speed Work', value: 10, color: '#ef4444' },
  ];

  const achievements = [
    { id: 1, name: 'First Run', description: 'Completed your first run', icon: '🏃‍♀️', earned: true, date: '2023-01-15' },
    { id: 2, name: '5K Finisher', description: 'Completed a 5K distance', icon: '🎯', earned: true, date: '2023-02-10' },
    { id: 3, name: '10K Finisher', description: 'Completed a 10K distance', icon: '🏅', earned: true, date: '2023-03-22' },
    { id: 4, name: 'Marathon Finisher', description: 'Completed a marathon distance', icon: '🏆', earned: false, date: null },
    { id: 5, name: 'Consistency King', description: 'Ran for 30 consecutive days', icon: '👑', earned: true, date: '2023-04-15' },
    { id: 6, name: 'Speed Demon', description: 'Achieved sub-4:00 pace', icon: '⚡', earned: false, date: null },
    { id: 7, name: 'Distance Master', description: 'Ran 100km in a month', icon: '🌟', earned: true, date: '2023-05-30' },
    { id: 8, name: 'Early Bird', description: 'Completed 10 morning runs', icon: '🌅', earned: true, date: '2023-06-08' },
  ];

  const stats = {
    totalRuns: user?.totalRuns || 0,
    totalDistance: user?.totalDistance || 0,
    averagePace: user?.averagePace || '0:00',
    totalTime: Math.round((user?.totalDistance || 0) * 5.5), // Estimated total time in minutes
    longestRun: 21.1,
    personalBest: '4:32',
    weeklyGoal: 25,
    weeklyProgress: 18.6,
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const earnedAchievements = achievements.filter(a => a.earned);
  const progressPercentage = (stats.weeklyProgress / stats.weeklyGoal) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6"
          >
            {/* Profile Image */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-1 text-white/80 hover:text-white"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-primary-100 mb-4">Member since {new Date(user.joinedAt).getFullYear()}</p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.totalRuns}</p>
                  <p className="text-primary-100 text-sm">Total Runs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.totalDistance}</p>
                  <p className="text-primary-100 text-sm">Kilometers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.averagePace}</p>
                  <p className="text-primary-100 text-sm">Avg Pace</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{earnedAchievements.length}</p>
                  <p className="text-primary-100 text-sm">Achievements</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'progress', label: 'Progress', icon: TrendingUp },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weekly Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Weekly Goal</h2>
                  <Target className="w-5 h-5 text-primary-500" />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{stats.weeklyProgress}km of {stats.weeklyGoal}km</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {stats.weeklyGoal - stats.weeklyProgress > 0 
                    ? `${(stats.weeklyGoal - stats.weeklyProgress).toFixed(1)}km to go this week`
                    : 'Weekly goal achieved! 🎉'
                  }
                </p>
              </motion.div>

              {/* Weekly Activity Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">This Week's Activity</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyRunsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="distance" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Run Types Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Run Types</h2>
                <div className="flex flex-col md:flex-row items-center">
                  <div className="h-64 w-full md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={runTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {runTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-3">
                    {runTypeData.map((type, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: type.color }}
                        />
                        <span className="text-sm text-gray-600">{type.name}</span>
                        <span className="text-sm font-medium text-gray-900">{type.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Personal Records */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Records</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Longest Run</span>
                    <span className="font-semibold">{stats.longestRun}km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Best 5K Time</span>
                    <span className="font-semibold">22:15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Best Pace</span>
                    <span className="font-semibold">{stats.personalBest}/km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Time</span>
                    <span className="font-semibold">{Math.floor(stats.totalTime / 60)}h {stats.totalTime % 60}m</span>
                  </div>
                </div>
              </motion.div>

              {/* Recent Achievements */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  {earnedAchievements.slice(-3).map(achievement => (
                    <div key={achievement.id} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">{achievement.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{achievement.name}</p>
                        <p className="text-xs text-gray-600">
                          {achievement.date && new Date(achievement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Upcoming Goals */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Goals</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <p className="font-medium text-primary-900 text-sm">Run a Half Marathon</p>
                    <p className="text-xs text-primary-600">Target: December 2024</p>
                  </div>
                  <div className="p-3 bg-accent-50 rounded-lg">
                    <p className="font-medium text-accent-900 text-sm">Sub-4:00 5K Pace</p>
                    <p className="text-xs text-accent-600">Current: {stats.averagePace}/km</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Monthly Progress Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Progress</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="distance" 
                      stroke="#0ea5e9" 
                      strokeWidth={3}
                      dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 6 }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="pace" 
                      stroke="#22c55e" 
                      strokeWidth={3}
                      dot={{ fill: '#22c55e', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            {/* Achievements Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`card ${achievement.earned ? 'ring-2 ring-yellow-200' : 'opacity-60'}`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      achievement.earned ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      <span className="text-2xl">{achievement.icon}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{achievement.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    {achievement.earned ? (
                      <div className="text-xs text-yellow-600 font-medium">
                        Earned {achievement.date && new Date(achievement.date).toLocaleDateString()}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">Not earned yet</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;