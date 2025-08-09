import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tip } from '../types';
import { 
  BookOpen, 
  Search, 
  Filter,
  Heart,
  Share2,
  Bookmark,
  Clock,
  Tag
} from 'lucide-react';

const TipsPage: React.FC = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const response = await fetch('/api/tips');
      const data = await response.json();
      setTips(data);
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Tips', color: 'bg-gray-100 text-gray-800' },
    { id: 'technique', name: 'Technique', color: 'bg-blue-100 text-blue-800' },
    { id: 'nutrition', name: 'Nutrition', color: 'bg-green-100 text-green-800' },
    { id: 'recovery', name: 'Recovery', color: 'bg-purple-100 text-purple-800' },
    { id: 'training', name: 'Training', color: 'bg-orange-100 text-orange-800' },
    { id: 'mindset', name: 'Mindset', color: 'bg-pink-100 text-pink-800' },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technique': return '🏃‍♀️';
      case 'nutrition': return '🥗';
      case 'recovery': return '🧘‍♀️';
      case 'training': return '📈';
      case 'mindset': return '🧠';
      default: return '📚';
    }
  };

  const filteredTips = tips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTipClick = (tip: Tip) => {
    setSelectedTip(tip);
  };

  const handleCloseModal = () => {
    setSelectedTip(null);
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
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Running Tips</h1>
              <p className="text-gray-600">Expert advice to improve your running</p>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? category.color
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {getCategoryIcon(category.id)} {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tips Grid */}
        <AnimatePresence>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTips.map((tip, index) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => handleTipClick(tip)}
              >
                {/* Tip Image */}
                <div className="relative mb-4">
                  <img
                    src={tip.image}
                    alt={tip.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      categories.find(c => c.id === tip.category)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {getCategoryIcon(tip.category)} {tip.category}
                    </span>
                  </div>
                </div>

                {/* Tip Content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {tip.content}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <Heart className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                      >
                        <Bookmark className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      5 min read
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredTips.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tips found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>

      {/* Tip Modal */}
      <AnimatePresence>
        {selectedTip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative">
                <img
                  src={selectedTip.image}
                  alt={selectedTip.title}
                  className="w-full h-64 object-cover rounded-t-2xl"
                />
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900"
                >
                  ×
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    categories.find(c => c.id === selectedTip.category)?.color || 'bg-gray-100 text-gray-800'
                  }`}>
                    {getCategoryIcon(selectedTip.category)} {selectedTip.category}
                  </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedTip.title}</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{selectedTip.content}</p>

                {/* Modal Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center text-gray-600 hover:text-red-500 transition-colors duration-200"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Like
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center text-gray-600 hover:text-blue-500 transition-colors duration-200"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center text-gray-600 hover:text-yellow-500 transition-colors duration-200"
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </motion.button>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    5 min read
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TipsPage;