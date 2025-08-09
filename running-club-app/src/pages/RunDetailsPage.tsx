import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Run, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  MapPin, 
  Clock, 
  Users, 
  Calendar as CalendarIcon,
  Share2,
  ArrowLeft,
  Heart,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';

const RunDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [run, setRun] = useState<Run | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRunDetails();
      fetchUsers();
    }
  }, [id]);

  const fetchRunDetails = async () => {
    try {
      const response = await fetch(`/api/runs/${id}`);
      const data = await response.json();
      setRun(data);
      setIsJoined(data.participants.includes(user?.id));
    } catch (error) {
      console.error('Error fetching run details:', error);
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

  const handleJoinLeave = async () => {
    if (!run || !user) return;

    try {
      let updatedParticipants;
      if (isJoined) {
        updatedParticipants = run.participants.filter(id => id !== user.id);
      } else {
        updatedParticipants = [...run.participants, user.id];
      }

      const response = await fetch(`/api/runs/${run.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participants: updatedParticipants
        }),
      });

      if (response.ok) {
        setIsJoined(!isJoined);
        setRun(prev => prev ? { ...prev, participants: updatedParticipants } : null);
      }
    } catch (error) {
      console.error('Error updating participation:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: run?.title,
        text: `Join me for ${run?.title} at ${run?.location}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  const handleAddToCalendar = () => {
    if (!run) return;

    const event = {
      title: run.title,
      description: run.description,
      location: run.location,
      startTime: new Date(run.time),
      endTime: new Date(new Date(run.time).getTime() + 2 * 60 * 60 * 1000), // 2 hours later
    };

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${event.startTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${event.endTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`;
    
    window.open(calendarUrl, '_blank');
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

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

  if (!run) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Run not found</h2>
          <p className="text-gray-600 mb-4">The run you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Back
          </button>
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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCalendar}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <CalendarIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mb-6"
            >
              {/* Run Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{run.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{run.location}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(run.difficulty)}`}>
                    {run.difficulty} difficulty
                  </span>
                </div>
              </div>

              {/* Run Stats */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">{run.distance}km</div>
                  <div className="text-sm text-gray-500">Distance</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-600">{run.pace}</div>
                  <div className="text-sm text-gray-500">Target Pace</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600">{run.participants.length}/{run.maxParticipants}</div>
                  <div className="text-sm text-gray-500">Runners</div>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center text-gray-600 mb-6">
                <Clock className="w-5 h-5 mr-2" />
                <span>{formatDate(run.time)}</span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About this run</h3>
                <p className="text-gray-700 leading-relaxed">{run.description}</p>
              </div>
            </motion.div>

            {/* Join Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {isJoined ? 'You\'re in!' : 'Ready to join?'}
                  </h3>
                  <p className="text-gray-600">
                    {isJoined 
                      ? 'You\'re all set for this run. See you there!' 
                      : `${run.maxParticipants - run.participants.length} spots remaining`
                    }
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleJoinLeave}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    isJoined
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {isJoined ? 'Leave Run' : 'Join Run'}
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participants */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Participants ({run.participants.length})
              </h3>
              <div className="space-y-3">
                {run.participants.map((participantId) => {
                  const participant = getUserById(participantId);
                  return (
                    <motion.div
                      key={participantId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-3"
                    >
                      <img
                        src={participant?.avatar}
                        alt={participant?.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{participant?.name}</p>
                        <p className="text-sm text-gray-500">{participant?.totalRuns} runs</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCalendar}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-3 text-primary-600" />
                    <span className="font-medium">Add to Calendar</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShare}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <Share2 className="w-5 h-5 mr-3 text-primary-600" />
                    <span className="font-medium">Share Run</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunDetailsPage;