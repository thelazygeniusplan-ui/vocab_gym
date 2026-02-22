import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isMocked = !supabaseUrl || !supabaseKey;

export const supabase = isMocked
    ? null
    : createClient(supabaseUrl, supabaseKey);

export async function logCompletion(studentId: string, word: string) {
    if (!supabase) {
        console.warn('[Supabase] Credentials missing. Mocking completion log:', { studentId, word });
        return;
    }
    const { error } = await supabase
        .from('completions')
        .insert([{ student_id: studentId, word }]);
    if (error) console.error('[Supabase] Error logging completion:', error);
}

export async function trackFatigue(wordId: string, userId: string, errorCount: number) {
    if (!supabase) {
        console.warn('[Supabase] Credentials missing. Mocking fatigue tracking.');
        return;
    }
    const { error } = await supabase
        .from('fatigue_logs')
        .insert([{ word_id: wordId, user_id: userId, error_count: errorCount, timestamp: new Date() }]);
    if (error) console.error('[Supabase] Error tracking fatigue:', error);
}

export async function getForgottenFactors(userId: string) {
    if (!supabase) {
        console.warn('[Supabase] Credentials missing. Returning mock forgotten factors.');
        return [];
    }
    const { data, error } = await supabase
        .from('user_progress')
        .select('word_id, decay_rate')
        .eq('user_id', userId)
        .gt('decay_rate', 0.7);
    if (error) {
        console.error('[Supabase] Error fetching forgotten factors:', error);
        return [];
    }
    return data;
}
