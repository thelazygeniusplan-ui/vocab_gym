export interface CurriculumItem {
    id: string;
    word: string;
    definition: string;
    category: string;
    synonyms: string[];
    antonyms: string[];
    contextSentence: string;
    processingLevel: 'shadow' | 'cinema' | 'synthesis' | 'mastery';
    videoUrl?: string;
}

export class PedagogicalArchitect {
    // Mandate: Director of Curriculum. Curates 150-word minimum corpus.
    // Scripts "Shadow Hints" (Loop 0), "Trainee Bot" errors (Loop 3), and "Deep Processing" workarounds.

    private corpus: CurriculumItem[] = [];

    constructor() {
        // Bundle 01: Bolster, Anomalous, Ambivalent, Qualify, Paucity

        this.corpus = [
            {
                id: '1',
                word: 'bolster',
                definition: 'To support or strengthen; prop up.',
                category: 'Support/Structure',
                synonyms: ['reinforce', 'buttress', 'fortify'],
                antonyms: ['undermine', 'weaken'],
                contextSentence: 'He hoped the new evidence would bolster his argument.',
                processingLevel: 'shadow',
                videoUrl: "https://shotstack-api-v1-output.s3-ap-southeast-2.amazonaws.com/ozif3qkhuw/8b91f6d1-33cb-4f14-a10c-9287cd632ad1.mp4"
            },
            {
                id: '2',
                word: 'anomalous',
                definition: 'Deviating from what is standard, normal, or expected.',
                category: 'Standard/Deviation',
                synonyms: ['abnormal', 'atypical', 'irregular'],
                antonyms: ['normal', 'typical', 'standard'],
                contextSentence: 'The scientist investigated the anomalous readings from the sensor.',
                processingLevel: 'shadow',
                videoUrl: "https://shotstack-api-v1-output.s3-ap-southeast-2.amazonaws.com/ozif3qkhuw/d413eb8e-a516-4a25-9d9e-e4f00eee0bba.mp4"
            },
            {
                id: '3',
                word: 'ambivalent',
                definition: 'Having mixed feelings or contradictory ideas about something or someone.',
                category: 'Emotion/Mindset',
                synonyms: ['unsure', 'undecided', 'torn'],
                antonyms: ['certain', 'resolute', 'unequivocal'],
                contextSentence: 'She felt ambivalent about the job offer, liking the pay but hating the commute.',
                processingLevel: 'shadow',
                videoUrl: "https://shotstack-api-v1-output.s3-ap-southeast-2.amazonaws.com/ozif3qkhuw/9866c1eb-7465-45b7-9fb2-20cdcc898091.mp4"
            },
            {
                id: '4',
                word: 'qualify',
                definition: 'To make a statement less absolute; to add reservations.',
                category: 'Logic/Argument',
                synonyms: ['modify', 'limit', 'restrict'],
                antonyms: ['generalize', 'affirm'],
                contextSentence: 'I must qualify my earlier praise; while good, it is not perfect.',
                processingLevel: 'shadow',
                videoUrl: "https://shotstack-api-v1-output.s3-ap-southeast-2.amazonaws.com/ozif3qkhuw/d6a2bda4-c160-4015-9925-f4d0a6d8d558.mp4"
            },
            {
                id: '5',
                word: 'paucity',
                definition: 'The presence of something only in small or insufficient quantities or amounts; scarcity.',
                category: 'Quantity/Amount',
                synonyms: ['scarcity', 'dearth', 'shortage'],
                antonyms: ['abundance', 'surplus', 'plethora'],
                contextSentence: 'There was a paucity of information regarding the incident.',
                processingLevel: 'shadow',
                videoUrl: "https://shotstack-api-v1-output.s3-ap-southeast-2.amazonaws.com/ozif3qkhuw/aba397eb-97d5-4d12-8f0a-65e910f13035.mp4"
            },
            // Bundle 02
            {
                id: '6',
                word: 'ephemeral',
                definition: 'Lasting for a very short time.',
                category: 'Time',
                synonyms: ['transient', 'fleeting'],
                antonyms: ['permanent'],
                contextSentence: 'Fame is ephemeral.',
                processingLevel: 'shadow',
                videoUrl: "https://shotstack-api-v1-output.s3-ap-southeast-2.amazonaws.com/ozif3qkhuw/fdb3193e-3bdd-48d6-86a4-4f26f015007e.mp4"
            },
            { id: '7', word: 'pragmatic', definition: 'Dealing with things sensibly and realistically.', category: 'Logic', synonyms: ['practical', 'sensible'], antonyms: ['idealistic'], contextSentence: 'A pragmatic approach to politics.', processingLevel: 'shadow' },
            { id: '8', word: 'venerable', definition: 'Accorded a great deal of respect, especially because of age, wisdom, or character.', category: 'Respect', synonyms: ['respected', 'distinguished'], antonyms: ['disreputable'], contextSentence: 'A venerable statesman.', processingLevel: 'shadow' },
            { id: '9', word: 'condone', definition: 'Accept and allow (behavior that is considered morally wrong or offensive) to continue.', category: 'Ethics', synonyms: ['disregard', 'accept'], antonyms: ['condemn'], contextSentence: 'The college cannot condone any behavior that involves illicit drugs.', processingLevel: 'shadow' },
            { id: '10', word: 'aesthetic', definition: 'Concerned with beauty or the appreciation of beauty.', category: 'Arts', synonyms: ['artistic', 'beautiful'], antonyms: ['ugly'], contextSentence: 'The pictures give great aesthetic pleasure.', processingLevel: 'shadow' },
            // Bundle 03
            { id: '11', word: 'mitigate', definition: 'Make less severe, serious, or painful.', category: 'Action', synonyms: ['alleviate', 'reduce'], antonyms: ['aggravate'], contextSentence: 'He wanted to mitigate misery in the world.', processingLevel: 'shadow' },
            { id: '12', word: 'reticent', definition: 'Not revealing one\'s thoughts or feelings readily.', category: 'Personality', synonyms: ['reserved', 'withdraw'], antonyms: ['expansive'], contextSentence: 'She was extremely reticent about her personal affairs.', processingLevel: 'shadow' },
            { id: '13', word: 'mundane', definition: 'Lacking interest or excitement; dull.', category: 'Quality', synonyms: ['boring', 'dull'], antonyms: ['extraordinary'], contextSentence: 'Seeking a way out of his mundane existence.', processingLevel: 'shadow' },
            { id: '14', word: 'zeal', definition: 'Great energy or enthusiasm in pursuit of a cause or an objective.', category: 'Emotion', synonyms: ['passion', 'ardor'], antonyms: ['apathy'], contextSentence: 'His zeal for privatization.', processingLevel: 'shadow' },
            { id: '15', word: 'paradox', definition: 'A seemingly absurd or self-contradictory statement or proposition that when investigated or explained may prove to be well founded or true.', category: 'Logic', synonyms: ['contradiction'], antonyms: ['normality'], contextSentence: 'In a paradox, he has discovered that stepping back from his job has increased the rewards he gleans from it.', processingLevel: 'shadow' },
            // Bundle 04
            { id: '16', word: 'obsequious', definition: 'Obedient or attentive to an excessive or servile degree.', category: 'Personality', synonyms: ['servile', 'sycophantic'], antonyms: ['domineering'], contextSentence: 'They were served by obsequious waiters.', processingLevel: 'shadow' },
            { id: '17', word: 'revere', definition: 'Feel deep respect or admiration for (something).', category: 'Emotion', synonyms: ['respect', 'admire'], antonyms: ['despise'], contextSentence: 'Cézanne\'s still lifes were revered by his contemporaries.', processingLevel: 'shadow' },
            { id: '18', word: 'digression', definition: 'A temporary departure from the main subject in speech or writing.', category: 'Communication', synonyms: ['deviation', 'detour'], antonyms: ['focus'], contextSentence: 'Let\'s return to the main topic after that brief digression.', processingLevel: 'shadow' },
            { id: '19', word: 'intuitive', definition: 'Using or based on what one feels to be true even without conscious reasoning.', category: 'Mind', synonyms: ['instinctive', 'innate'], antonyms: ['calculated'], contextSentence: 'His intuitive grasp of mathematics.', processingLevel: 'shadow' },
            { id: '20', word: 'scrutinize', definition: 'Examine or inspect closely and thoroughly.', category: 'Action', synonyms: ['inspect', 'examine'], antonyms: ['glance'], contextSentence: 'Customers were warned to scrutinize the small print.', processingLevel: 'shadow' },
            // Bundle 05
            { id: '21', word: 'substantiate', definition: 'Provide evidence to support or prove the truth of.', category: 'Logic', synonyms: ['prove', 'support'], antonyms: ['disprove'], contextSentence: 'They had found nothing to substantiate the allegations.', processingLevel: 'shadow' },
            { id: '22', word: 'benevolent', definition: 'Well meaning and kindly.', category: 'Personality', synonyms: ['kind', 'kindly'], antonyms: ['unkind'], contextSentence: 'A benevolent smile.', processingLevel: 'shadow' },
            { id: '23', word: 'emulate', definition: 'Match or surpass (a person or achievement), typically by imitation.', category: 'Action', synonyms: ['imitate', 'copy'], antonyms: ['neglect'], contextSentence: 'Lesser men trying to emulate his greatness.', processingLevel: 'shadow' },
            { id: '24', word: 'prudent', definition: 'Acting with or showing care and thought for the future.', category: 'Personality', synonyms: ['wise', 'sensible'], antonyms: ['reckless'], contextSentence: 'No prudent money manager would authorize a loan without security.', processingLevel: 'shadow' },
            { id: '25', word: 'inevitable', definition: 'Certain to happen; unavoidable.', category: 'Future', synonyms: ['unavoidable', 'inescapable'], antonyms: ['avoidable'], contextSentence: 'War was inevitable.', processingLevel: 'shadow' }
        ];
    }

    getRotationSchedule(minute: number): 'LOOP_0' | 'LOOP_1' | 'LOOP_2' | 'LOOP_3' {
        // 15-Minute Station Rotation Logic
        if (minute < 3) return 'LOOP_0'; // Shadow
        if (minute < 5) return 'LOOP_1'; // Cinema (Short)
        if (minute < 10) return 'LOOP_2'; // Synthesis
        return 'LOOP_3'; // Mastery
    }

    getCurriculum(): CurriculumItem[] {
        return this.corpus;
    }

    generateShadowHint(word: string): string {
        // Loop 0: Shadow Hints - Cryptic and Indirect
        const item = this.corpus.find(c => c.word === word);
        if (!item) return "Data corrupted. Word not found.";

        // Cryptic Logic: Uses category and antonym only, no synonyms.
        return `[ARCHITECT]: A phantom in the realm of [${item.category}]. It is the negation of '${item.antonyms[0]}'.`;
    }

    generateTraineeError(word: string): string {
        // Loop 3: Mastery - Trainee Bot makes a logical error
        const item = this.corpus.find(c => c.word === word);
        if (!item) return "System Error.";

        // Logic: Invert the definition slightly
        return `[TRAINEE_BOT]: Wait, does '${word}' mean something that lasts forever? Like '${item.antonyms[0]}'?`;
    }

    triggerDeepProcessing(word: string): string {
        // Deep Processing Workaround for Fatigue
        return `[ARCHITECT]: Detection: Cognitive fatigue on '${word}'. Rerouting to etymological breakdown...`;
    }
}
