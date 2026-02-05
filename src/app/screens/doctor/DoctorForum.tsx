import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { DoctorLayout } from '@/app/components/doctor/DoctorLayout';
import { forumService, ResearchPost } from '@/services/doctor/forumService';
import { doctorAuthService } from '@/services/doctor/doctorAuthService';
import { MessageSquare, ThumbsUp, Tag, Filter, PenTool, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function DoctorForum() {
    const [posts, setPosts] = useState<ResearchPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
    const [currentDoctor, setCurrentDoctor] = useState<any>(null);

    useEffect(() => {
        loadForum();
        doctorAuthService.getCurrentDoctor().then(setCurrentDoctor);
    }, []);

    const loadForum = async () => {
        try {
            // Mock data fallback if DB empty
            const data = await forumService.getPosts().catch(() => []);
            if (data.length === 0) {
                setPosts([
                    {
                        id: '1',
                        title: 'New approach to treating Type 2 Diabetes in adolescents',
                        content: 'Recent studies show that combining...',
                        tags: ['Endocrinology', 'Research'],
                        upvotes: 45,
                        created_at: new Date().toISOString(),
                        doctor_id: '123',
                        doctor: { full_name: 'Dr. Sarah Smith', specialization: 'Endocrinologist', blue_tick: true, live_photo_url: '' },
                        comments: [{ count: 12 }]
                    } as any
                ]);
            } else {
                setPosts(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async () => {
        if (!newPost.title || !newPost.content) return toast.error("Title and content required");

        try {
            await forumService.createPost(currentDoctor.id, {
                title: newPost.title,
                content: newPost.content,
                tags: newPost.tags.split(',').map(t => t.trim())
            });
            toast.success("Post created!");
            setShowCreate(false);
            loadForum();
        } catch (e) {
            toast.error("Failed to create post");
        }
    };

    const handleVote = async (id: string, type: 1 | -1) => {
        // Optimistic update
        setPosts(prev => prev.map(p => p.id === id ? { ...p, upvotes: p.upvotes + type } : p));
        if (currentDoctor) {
            await forumService.votePost(id, currentDoctor.id, type);
        }
    };

    return (
        <DoctorLayout>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Research Forum</h1>
                        <button
                            onClick={() => setShowCreate(!showCreate)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium"
                        >
                            <PenTool className="w-4 h-4" /> Create Post
                        </button>
                    </div>

                    {showCreate && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-4">
                            <input
                                placeholder="Post Title"
                                className="w-full text-lg font-bold mb-4 p-2 border-b border-slate-100 dark:border-slate-800 bg-transparent outline-none"
                                value={newPost.title}
                                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            />
                            <ReactQuill
                                theme="snow"
                                value={newPost.content}
                                onChange={(val) => setNewPost({ ...newPost, content: val })}
                                className="mb-4 h-40"
                            />
                            <div className="mt-12 flex justify-between items-center">
                                <input
                                    placeholder="Tags (comma separated)"
                                    className="text-sm p-2 bg-slate-50 dark:bg-slate-800 rounded-lg w-1/2"
                                    value={newPost.tags}
                                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                                />
                                <div className="flex gap-2">
                                    <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                                    <button onClick={handleCreatePost} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium">Post</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {posts.map(post => (
                            <div key={post.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-blue-200 transition-colors">
                                <div className="flex items-start gap-4">
                                    {/* Vote Column */}
                                    <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                                        <button onClick={() => handleVote(post.id, 1)} className="p-1 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded">
                                            <ThumbsUp className="w-5 h-5" />
                                        </button>
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{post.upvotes}</span>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 cursor-pointer hover:text-blue-600">
                                            {post.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-3">
                                            {post.tags?.map(tag => (
                                                <span key={tag} className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full flex items-center gap-1">
                                                    <Tag className="w-3 h-3" /> {tag}
                                                </span>
                                            ))}
                                            <span className="text-xs text-slate-400">• Posted by Dr. {post.doctor?.full_name}</span>
                                        </div>

                                        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: post.content }} />

                                        <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                                            <button className="flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 px-2 py-1 rounded">
                                                <MessageSquare className="w-4 h-4" /> {post.comments?.[0]?.count || 0} Comments
                                            </button>
                                            <button className="flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 px-2 py-1 rounded">
                                                <Share2 className="w-4 h-4" /> Share
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden lg:block lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Filter className="w-4 h-4" /> Trending Topics
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {["Cardiology", "COVID-19", "Telemedicine", "Pediatrics", "Neurology", "Mental Health"].map(t => (
                                <span key={t} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-100">
                                    #{t}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                        <h3 className="font-bold text-lg mb-2">Verified Doctors Only</h3>
                        <p className="text-blue-100 text-sm mb-4">This forum is exclusive for verified medical professionals to share research and cases.</p>
                        <button className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                            Read Guidelines
                        </button>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
}
