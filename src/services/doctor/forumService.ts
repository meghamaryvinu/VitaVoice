import { supabase } from '@/config/supabase'

export interface ResearchPost {
    id: string
    doctor_id: string
    title: string
    content: string
    tags: string[]
    upvotes: number
    created_at: string
    doctor: {
        full_name: string
        specialization: string
        blue_tick: boolean
        live_photo_url: string
    }
    comments: { count: number }[]
}

export interface PostComment {
    id: string
    post_id: string
    doctor_id: string
    content: string
    created_at: string
    doctor: {
        full_name: string
        live_photo_url: string
    }
}

export const forumService = {
    async getPosts() {
        const { data, error } = await supabase
            .from('research_posts')
            .select(`
        *,
        doctor:doctors (full_name, specialization, blue_tick, live_photo_url),
        comments:post_comments(count)
      `)
            .order('created_at', { ascending: false })

        if (error) throw error

        // Map live_photo_url to public URL
        const postsWithUrls = await Promise.all(data.map(async (post: any) => {
            const photoUrl = post.doctor?.live_photo_url
                ? supabase.storage.from('doctor-profiles').getPublicUrl(post.doctor.live_photo_url).data.publicUrl
                : null
            return {
                ...post,
                doctor: { ...post.doctor, live_photo_url: photoUrl }
            }
        }))

        return postsWithUrls as ResearchPost[]
    },

    async createPost(doctorId: string, post: { title: string, content: string, tags: string[] }) {
        const { data, error } = await supabase
            .from('research_posts')
            .insert({
                doctor_id: doctorId,
                ...post
            })
            .select()
            .single()

        if (error) throw error
        return data
    },

    async getComments(postId: string) {
        const { data, error } = await supabase
            .from('post_comments')
            .select(`
        *,
        doctor:doctors (full_name, live_photo_url)
      `)
            .eq('post_id', postId)
            .order('created_at', { ascending: true })

        if (error) throw error
        return data as PostComment[]
    },

    async addComment(postId: string, doctorId: string, content: string) {
        const { data, error } = await supabase
            .from('post_comments')
            .insert({
                post_id: postId,
                doctor_id: doctorId,
                content
            })
            .select()
            .single()

        if (error) throw error
        return data
    },

    async votePost(postId: string, doctorId: string, voteType: 1 | -1) {
        // Upsert vote
        const { error } = await supabase
            .from('post_votes')
            .upsert({
                post_id: postId,
                doctor_id: doctorId,
                vote_type: voteType
            }, { onConflict: 'post_id,doctor_id' })

        if (error) throw error

        // Trigger function to update count would be ideal, but for now we rely on re-fetching
        // Real implementation should use RPC or Trigger
        return true
    }
}
