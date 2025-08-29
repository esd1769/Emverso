'use server';

import {auth} from "@clerk/nextjs/server";
import {createSupabaseClient} from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const createCompanion = async (formData: CreateCompanion) => {
    const { userId: author } = await auth();
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('companions')
        .insert({...formData, author })
        .select();

    if(error || !data) throw new Error(error?.message || 'Failed to create a companion');

    return data[0];
}

export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
    const supabase = createSupabaseClient();
    const { userId } = await auth();

    let query = supabase.from('companions').select('*, author');

    if(subject) {
        query = query.or(`topic.ilike.%${subject}%,name.ilike.%${subject}%`)
    }

    if(topic) {
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    }


    query = query.range((page - 1) * limit, page * limit - 1);

    const { data: companions, error } = await query;

    if(error) throw new Error(error.message);
    
    // Get bookmarks for the current user
    let bookmarks = [];
    if (userId) {
        const { data: bookmarksData } = await supabase
            .from("bookmarks")
            .select("companion_id")
            .eq("user_id", String(userId));
        
        bookmarks = bookmarksData?.map(b => b.companion_id) || [];
    }

    // Add isAuthor flag and bookmarked status to each companion
    const companionsWithAuthorship = companions.map(companion => ({
        ...companion,
        isAuthor: companion.author === userId,
        bookmarked: bookmarks.includes(companion.id)
    }));

    return companionsWithAuthorship;
}

export const getCompanion = async (id: string) => {
    const supabase = createSupabaseClient();
    const { userId } = await auth();

    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('id', id);

    if(error) return console.log(error);
    
    // Check if the companion is bookmarked by the current user
    let isBookmarked = false;
    if (userId) {
        const { data: bookmarkData } = await supabase
            .from("bookmarks")
            .select()
            .eq("companion_id", id)
            .eq("user_id", String(userId));
        
        isBookmarked = bookmarkData && bookmarkData.length > 0;
    }

    return { ...data[0], bookmarked: isBookmarked };
}

export const addToSessionHistory = async (companionId: string) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('session_history')
        .insert({
            companion_id: companionId,
            user_id: userId,
        })

    if(error) throw new Error(error.message);

    return data;
}

export const getRecentSessions = async (limit = 10) => {
    const supabase = createSupabaseClient();
    const { userId } = await auth();
    
    // If user is logged in, get their sessions, otherwise get all recent sessions
    const query = supabase
        .from('session_history')
        .select(`companions:companion_id (*)`)
        .order('created_at', { ascending: false })
        .limit(limit)
    
    // Filter by user ID if a user is logged in
    if (userId) {
        query.eq('user_id', userId)
    }
    
    const { data, error } = await query

    if(error) throw new Error(error.message);

    // Get bookmarks for the current user
    let bookmarks = [];
    if (userId) {
        const { data: bookmarksData } = await supabase
            .from("bookmarks")
            .select("companion_id")
            .eq("user_id", String(userId));
        
        bookmarks = bookmarksData?.map(b => b.companion_id) || [];
    }

    //return data.map(({ companions }) => companions);
    // flatten and remove duplicates by companion id
    const companionsList = data.map(d => d.companions).flat();
    const uniqueCompanions = Array.from(
        new Map(companionsList.map(c => [c.id, c])).values()
    );

    // Add bookmarked status to each companion
    const companionsWithBookmarks = uniqueCompanions.map(companion => ({
        ...companion,
        bookmarked: bookmarks.includes(companion.id)
    }));

    return companionsWithBookmarks;
}
export const deleteCompanion = async (companionId: string) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('companions')
        .delete()
        .eq('id', companionId)
        .eq('author', userId);  // optional: only allow author to delete

    if (error) throw new Error(error.message);

    return data;
}


export const getUserSessions = async (userId: string, limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id (*)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);
    
    // Get bookmarks for the current user
    const { data: bookmarksData } = await supabase
        .from("bookmarks")
        .select("companion_id")
        .eq("user_id", String(userId));
    
    const bookmarks = bookmarksData?.map(b => b.companion_id) || [];

    //return data.map(({ companions }) => companions);
    // flatten and remove duplicates by companion id
    const companionsList = data.map(d => d.companions).flat();
    const uniqueCompanions = Array.from(
        new Map(companionsList.map(c => [c.id, c])).values()
    );
    
    // Add bookmarked status to each companion
    const companionsWithBookmarks = uniqueCompanions.map(companion => ({
        ...companion,
        bookmarked: bookmarks.includes(companion.id)
    }));

    return companionsWithBookmarks;
}

export const getUserCompanions = async (userId: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('author', userId)

    if(error) throw new Error(error.message);
    
    // Get bookmarks for the current user
    const { data: bookmarksData } = await supabase
        .from("bookmarks")
        .select("companion_id")
        .eq("user_id", String(userId));
    
    const bookmarks = bookmarksData?.map(b => b.companion_id) || [];
    
    // Add bookmarked status to each companion
    const companionsWithBookmarks = data.map(companion => ({
        ...companion,
        bookmarked: bookmarks.includes(companion.id)
    }));

    return companionsWithBookmarks;
}

export const newCompanionPermissions = async () => {
    const { userId, has } = await auth();
    const supabase = createSupabaseClient();

    let limit = 0;

    if(has({ plan: 'pro' })) {
        return true;
    } else if(has({ feature: "20_companion_limit" })) {
        limit = 20;
    } else if(has({ feature: "10_companion_limit" })) {
        limit = 10;
    }

    const { data, error } = await supabase
        .from('companions')
        .select('id', { count: 'exact' })
        .eq('author', userId)

    if(error) throw new Error(error.message);

    const companionCount = data?.length;

    if(companionCount >= limit) {
        return false
    } else {
        return true;
    }
}

// Bookmarks
export const addBookmark = async (companionId: string, path: string) => {
    const { userId } = await auth();
    if (!userId) return;
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from("bookmarks").insert({
        companion_id: companionId,
        user_id: String(userId),
    });
    if (error) {
        throw new Error(error.message);
    }
    // Revalidate the path to force a re-render of the page

    revalidatePath(path);
    return data;
};

export const removeBookmark = async (companionId: string, path: string) => {
    const { userId } = await auth();
    if (!userId) return;
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("companion_id", companionId)
        .eq("user_id", String(userId));
    if (error) {
        throw new Error(error.message);
    }
    revalidatePath(path);
    return data;
};

// It's almost the same as getUserCompanions, but it's for the bookmarked companions
export const getBookmarkedCompanions = async (userId: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from("bookmarks")
        .select(`companions:companion_id (*)`) // Notice the (*) to get all the companion data
        .eq("user_id", userId);
    if (error) {
        throw new Error(error.message);
    }
    // We don't need the bookmarks data, so we return only the companions
    // Make sure to set bookmarked to true for all companions
    return data.map(({ companions }) => ({
        ...companions,
        bookmarked: true
    }));
};