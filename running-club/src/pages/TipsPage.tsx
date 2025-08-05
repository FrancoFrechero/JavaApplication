import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Article } from '../types';
import { 
  Search, 
  Filter, 
  Clock, 
  BookOpen, 
  Heart, 
  Zap, 
  Target,
  TrendingUp,
  Award,
  Lightbulb
} from 'lucide-react';

const TipsPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Technique', 'Nutrition', 'Health', 'Training', 'Motivation', 'Gear'];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technique': return Target;
      case 'Nutrition': return Heart;
      case 'Health': return Heart;
      case 'Training': return TrendingUp;
      case 'Motivation': return Award;
      case 'Gear': return Zap;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technique': return 'bg-blue-100 text-blue-600';
      case 'Nutrition': return 'bg-green-100 text-green-600';
      case 'Health': return 'bg-red-100 text-red-600';
      case 'Training': return 'bg-purple-100 text-purple-600';
      case 'Motivation': return 'bg-yellow-100 text-yellow-600';
      case 'Gear': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extended articles with more content
  const extendedArticles = [
    ...articles,
    {
      id: 5,
      title: 'Proper Running Warm-Up Routine',
      excerpt: 'Essential warm-up exercises to prevent injury and improve performance.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
      category: 'Technique',
      readTime: '4 min read'
    },
    {
      id: 6,
      title: 'Hydration Strategies for Long Runs',
      excerpt: 'Stay properly hydrated during extended running sessions.',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=200&fit=crop',
      category: 'Nutrition',
      readTime: '6 min read'
    },
    {
      id: 7,
      title: 'Mental Strategies for Race Day',
      excerpt: 'Psychological techniques to perform your best when it matters.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
      category: 'Motivation',
      readTime: '5 min read'
    },
    {
      id: 8,
      title: 'Choosing the Right Running Shoes',
      excerpt: 'Find the perfect pair of running shoes for your foot type and running style.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop',
      category: 'Gear',
      readTime: '7 min read'
    },
    {
      id: 9,
      title: 'Recovery and Rest Day Importance',
      excerpt: 'Why rest days are crucial for improving your running performance.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop',
      category: 'Health',
      readTime: '5 min read'
    },
    {
      id: 10,
      title: 'Building Your Base: Aerobic Foundation',
      excerpt: 'How to build a strong aerobic base for long-term running success.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
      category: 'Training',
      readTime: '8 min read'
    }
  ];

  const filteredExtendedArticles = extendedArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Running Tips & Guides</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert advice, training tips, and insights to help you become a better runner
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Article */}
      {filteredExtendedArticles.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card overflow-hidden mb-8"
          >
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={filteredExtendedArticles[0].image}
                  alt={filteredExtendedArticles[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(filteredExtendedArticles[0].category)}`}>
                    {filteredExtendedArticles[0].category}
                  </span>
                  <span className="ml-3 text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {filteredExtendedArticles[0].readTime}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {filteredExtendedArticles[0].title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {filteredExtendedArticles[0].excerpt}
                </p>
                <button className="btn-primary">
                  Read Full Article
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Articles Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExtendedArticles.slice(1).map((article, index) => {
            const IconComponent = getCategoryIcon(article.category);
            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              >
                {/* Article Image */}
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{article.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="pt-4 border-t border-gray-100">
                    <button className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center">
                      Read More
                      <motion.span
                        className="ml-1"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredExtendedArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Get Weekly Running Tips
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and receive expert running advice, training plans, and motivation directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </motion.button>
            </div>
            <p className="text-primary-200 text-sm mt-4">
              No spam, unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TipsPage;