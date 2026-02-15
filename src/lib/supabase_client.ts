// import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Mock Client
const supabase = {
    from: (_table: string) => ({
        insert: async (_data: unknown[]) => ({ error: null }),
        select: (_columns: string) => ({
            eq: (_col: string, _val: string) => ({
                gt: async (_col: string, _val: number) => ({ data: [], error: null })
            })
        })
    })
};

export async function trackFatigue(wordId: string, userId: string, errorCount: number) {
    if (!supabaseUrl || !supabaseKey) {
        console.warn("[Supabase] Credentials missing. Mocking fatigue tracking.");
        return;
    }

    const { error } = await supabase
        .from('fatigue_logs')
        .insert([{ word_id: wordId, user_id: userId, error_count: errorCount, timestamp: new Date() }]);

    if (error) console.error("[Supabase] Error tracking fatigue:", error);
}

export async function getForgottenFactors(userId: string) {
    if (!supabaseUrl || !supabaseKey) {
        console.warn("[Supabase] Credentials missing. Returning mock forgotten factors.");
        return [];
    }

    // Fetch words where decay_rate is high (mock logic for column name)
    const { data, error } = await supabase
        .from('user_progress')
        .select('word_id, decay_rate')
        .eq('user_id', userId)
        .gt('decay_rate', 0.7);

    if (error) {
        console.error("[Supabase] Error fetching forgotten factors:", error);
        return [];
    }
    return data;
}
