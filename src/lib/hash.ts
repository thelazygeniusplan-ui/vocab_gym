const HASH_SALT = 'VOCAB_GYM_V2';

export function generateHash(studentId: string, random: string): string {
    const normalized = studentId.replace(/-/g, '').toUpperCase();
    const raw = normalized + random + HASH_SALT;
    const checksum = raw.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 1000;
    return `SESSION-${normalized}-${random}-${String(checksum).padStart(3, '0')}`;
}

export function verifyHash(hash: string): { valid: boolean; studentId: string | null } {
    const parts = hash.toUpperCase().split('-');
    // Expected format: SESSION-STUDENTID-RANDOM(6)-CHECKSUM(3) => exactly 4 parts
    if (parts.length !== 4 || parts[0] !== 'SESSION') {
        return { valid: false, studentId: null };
    }
    const [, studentId, random, checksum] = parts;
    const reconstructed = generateHash(studentId, random);
    if (reconstructed.toUpperCase() !== hash.toUpperCase()) {
        return { valid: false, studentId: null };
    }
    return { valid: true, studentId };
}
