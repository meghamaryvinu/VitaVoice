import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, BookOpen, Search, X, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { healthEducationService, type HealthTopic } from '@/services/healthEducationService';

export const HealthEducation = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedTopic, setSelectedTopic] = useState<HealthTopic | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const categories = healthEducationService.getCategories();
    const allTopics = healthEducationService.getAllTopics();

    const filteredTopics = searchQuery
        ? healthEducationService.searchTopics(searchQuery)
        : selectedCategory === 'all'
            ? allTopics
            : healthEducationService.getTopicsByCategory(selectedCategory as any);

    const handleTopicClick = (topic: HealthTopic) => {
        setSelectedTopic(topic);
        healthEducationService.markAsRead(topic.id);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] px-4 py-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate('/home')}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </motion.button>
                    <h1 className="text-2xl font-bold">{t('health_education')}</h1>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('search_health_topics')}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                    />
                </div>
            </div>

            <div className="px-4 py-6">
                {/* Categories */}
                <div className="mb-6">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${selectedCategory === 'all'
                                    ? 'bg-[#8B5CF6] text-white'
                                    : 'bg-white text-gray-700 border border-gray-200'
                                }`}
                        >
                            {t('all_topics')}
                        </motion.button>
                        {categories.map((category) => (
                            <motion.button
                                key={category.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${selectedCategory === category.id
                                        ? 'bg-[#8B5CF6] text-white'
                                        : 'bg-white text-gray-700 border border-gray-200'
                                    }`}
                            >
                                {category.icon} {category.name}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Topics Grid */}
                <div className="grid grid-cols-1 gap-3">
                    {filteredTopics.map((topic, index) => {
                        const isRead = healthEducationService.isTopicRead(topic.id);
                        return (
                            <motion.div
                                key={topic.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleTopicClick(topic)}
                                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-6 h-6 text-[#8B5CF6]" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-semibold text-[#1E293B]">{topic.title}</h3>
                                            {isRead && (
                                                <CheckCircle className="w-5 h-5 text-[#059669] flex-shrink-0 ml-2" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{topic.content}</p>
                                        <div className="mt-2">
                                            <span className="text-xs text-[#8B5CF6] font-medium">
                                                {topic.keyPoints.length} {t('key_points')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredTopics.length === 0 && (
                    <div className="text-center py-16">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">{t('no_topics_found')}</p>
                    </div>
                )}
            </div>

            {/* Topic Detail Modal */}
            <AnimatePresence>
                {selectedTopic && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedTopic(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-[#1E293B]">{selectedTopic.title}</h2>
                                    <p className="text-sm text-gray-600 mt-1">{selectedTopic.content}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedTopic(null)}
                                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center flex-shrink-0 ml-2"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-semibold text-[#1E293B] flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-[#059669]" />
                                    Key Points to Remember
                                </h3>
                                {selectedTopic.keyPoints.map((point, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-start gap-3 bg-[#8B5CF6]/5 rounded-lg p-3"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                                            {index + 1}
                                        </div>
                                        <p className="text-sm text-gray-700 flex-1">{point}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <p className="text-sm text-yellow-800">
                                    <strong>Remember:</strong> This information is for awareness only. Always consult a qualified doctor for medical advice and treatment.
                                </p>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedTopic(null)}
                                className="w-full mt-6 py-3 bg-[#8B5CF6] text-white rounded-xl font-medium"
                            >
                                Got it!
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
