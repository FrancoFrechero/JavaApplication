import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Run, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  MapPin, 
  Clock, 
  Users, 
  TrendingUp, 
  Calendar,
  Heart,
  Share2,
  Filter,
  Search
} from 'lucide-react';

const FeedPage: React.FC = () => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchRuns();
    fetchUsers();
  }, []);

  const fetchRuns = async () => {
    try {
      const response = await fetch('/api/runs');
      const data = await response.json();
      setRuns(data);
    } catch (error) {
      console.error('Error fetching runs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleJoinRun = async (runId: string) => {
    try {
      const response = await fetch(`/api/runs/${runId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participants: [...runs.find(r => r.id === runId)?.participants || [], user?.id]
        }),
      });

      if (response.ok) {
        fetchRuns(); // Refresh runs
      }
    } catch (error) {
      console.error('Error joining run:', error);
    }
  };

  const handleLeaveRun = async (runId: string) => {
    try {
      const run = runs.find(r => r.id === runId);
      const updatedParticipants = run?.participants.filter(id => id !== user?.id) || [];
      
      const response = await fetch(`/api/runs/${runId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participants: updatedParticipants
        }),
      });

      if (response.ok) {
        fetchRuns(); // Refresh runs
      }
    } catch (error) {
      console.error('Error leaving run:', error);
    }
  };

  const isJoined = (run: Run) => {
    return run.participants.includes(user?.id || '');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const filteredRuns = runs.filter(run => {
    const matchesSearch = run.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         run.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterDifficulty === 'all' || run.difficulty === filterDifficulty;
    return matchesSearch && matchesFilter;
  });

  const getUserById = (userId: string) => {
    return users.find(u => u.id === userId);
  };

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
        className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Upcoming Runs</h1>
              <p className="text-gray-600">Find your next adventure</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Create Run
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search runs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Runs Grid */}
        <AnimatePresence>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRuns.map((run, index) => (
              <motion.div
                key={run.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow duration-200"
              >
                {/* Run Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{run.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {run.location}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(run.difficulty)}`}>
                    {run.difficulty}
                  </span>
                </div>

                {/* Run Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{run.distance}km</div>
                    <div className="text-xs text-gray-500">Distance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary-600">{run.pace}</div>
                    <div className="text-xs text-gray-500">Pace</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">{run.participants.length}/{run.maxParticipants}</div>
                    <div className="text-xs text-gray-500">Runners</div>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatDate(run.time)}
                </div>

                {/* Participants */}
                <div className="flex items-center mb-4">
                  <div className="flex -space-x-2 mr-3">
                    {run.participants.slice(0, 3).map((participantId, idx) => {
                      const participant = getUserById(participantId);
                      return (
                        <motion.img
                          key={participantId}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          src={participant?.avatar}
                          alt={participant?.name}
                          className="w-8 h-8 rounded-full border-2 border-white"
                        />
                      );
                    })}
                  </div>
                  {run.participants.length > 3 && (
                    <span className="text-sm text-gray-500">
                      +{run.participants.length - 3} more
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => isJoined(run) ? handleLeaveRun(run.id) : handleJoinRun(run.id)}
                    className={`flex-1 mr-2 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                      isJoined(run)
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                    }`}
                  >
                    {isJoined(run) ? 'Leave' : 'Join'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredRuns.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <TrendingUp className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No runs found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;