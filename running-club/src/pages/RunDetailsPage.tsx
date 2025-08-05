import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Run, User } from '../types';
import { 
  ArrowLeft,
  MapPin, 
  Calendar,
  Clock,
  Users, 
  Gauge,
  Share2,
  CalendarPlus,
  UserPlus,
  UserMinus,
  MessageCircle,
  Star
} from 'lucide-react';

const RunDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [run, setRun] = useState<Run | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

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
      setRun(data.run);
    } catch (error) {
      console.error('Failed to fetch run details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    if (run && users.length > 0) {
      const runParticipants = users.filter(user => run.participants.includes(user.id));
      setParticipants(runParticipants);
    }
  }, [run, users]);

  const handleJoinRun = async () => {
    if (!user || !run) return;
    
    try {
      const response = await fetch(`/api/runs/${run.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      
      if (response.ok) {
        const updatedRun = await response.json();
        setRun(updatedRun);
      }
    } catch (error) {
      console.error('Failed to join run:', error);
    }
  };

  const handleLeaveRun = async () => {
    if (!user || !run) return;
    
    try {
      const response = await fetch(`/api/runs/${run.id}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      
      if (response.ok) {
        const updatedRun = await response.json();
        setRun(updatedRun);
      }
    } catch (error) {
      console.error('Failed to leave run:', error);
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
      setShowShareModal(true);
    }
  };

  const handleAddToCalendar = () => {
    if (!run) return;
    
    const startDate = new Date(run.dateTime);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(run.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(run.description)}&location=${encodeURIComponent(run.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowShareModal(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-orange-600 bg-orange-100';
      case 'Very Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading run details...</p>
        </div>
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
            onClick={() => navigate('/feed')}
            className="btn-primary"
          >
            Back to Runs
          </button>
        </div>
      </div>
    );
  }

  const isParticipant = user && run.participants.includes(user.id);
  const isFull = run.participants.length >= run.maxParticipants;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/feed')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Runs
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-64 md:h-80 rounded-2xl overflow-hidden"
            >
              <img
                src={run.image}
                alt={run.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{run.title}</h1>
                    <div className="flex items-center text-white/90">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{run.location}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(run.difficulty)}`}>
                    {run.difficulty}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About this run</h2>
              <p className="text-gray-600 leading-relaxed">{run.description}</p>
            </motion.div>

            {/* Run Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Run Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Calendar className="w-6 h-6 text-primary-600" />
                  </div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-semibold text-gray-900">{formatDate(run.dateTime)}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Gauge className="w-6 h-6 text-accent-600" />
                  </div>
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="font-semibold text-gray-900">{run.distance} km</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <p className="text-sm text-gray-600">Pace</p>
                  <p className="font-semibold text-gray-900">{run.pace}/km</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600">Participants</p>
                  <p className="font-semibold text-gray-900">{run.participants.length}/{run.maxParticipants}</p>
                </div>
              </div>
            </motion.div>

            {/* Participants List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Participants ({participants.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {participants.map((participant, index) => (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{participant.name}</p>
                      <p className="text-xs text-gray-600">{participant.totalRuns} runs</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card space-y-4"
            >
              {isParticipant ? (
                <button
                  onClick={handleLeaveRun}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors duration-200"
                >
                  <UserMinus className="w-5 h-5 mr-2" />
                  Leave Run
                </button>
              ) : (
                <button
                  onClick={handleJoinRun}
                  disabled={isFull}
                  className="w-full flex items-center justify-center px-4 py-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  {isFull ? 'Run is Full' : 'Join Run'}
                </button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center px-4 py-2 btn-secondary text-sm"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                <button
                  onClick={handleAddToCalendar}
                  className="flex items-center justify-center px-4 py-2 btn-secondary text-sm"
                >
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  Calendar
                </button>
              </div>
            </motion.div>

            {/* Organizer Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizer</h3>
              {users.find(u => u.id === run.createdBy) && (
                <div className="flex items-center">
                  <img
                    src={users.find(u => u.id === run.createdBy)?.avatar}
                    alt={users.find(u => u.id === run.createdBy)?.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {users.find(u => u.id === run.createdBy)?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {users.find(u => u.id === run.createdBy)?.totalRuns} runs organized
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Spots available</span>
                  <span className="font-medium">{run.maxParticipants - run.participants.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(run.difficulty)}`}>
                    {run.difficulty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated time</span>
                  <span className="font-medium">
                    {Math.round((run.distance * parseFloat(run.pace.split(':')[0]) + run.distance * parseFloat(run.pace.split(':')[1]) / 60))} min
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this run</h3>
            <div className="space-y-3">
              <button
                onClick={() => copyToClipboard(window.location.href)}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Copy link
              </button>
              <button
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?text=Join me for ${run.title} at ${run.location}&url=${window.location.href}`, '_blank');
                  setShowShareModal(false);
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Share on Twitter
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 btn-secondary"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RunDetailsPage;