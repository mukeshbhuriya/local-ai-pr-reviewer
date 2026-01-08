/**
 * Splits a massive git diff string into separate file blocks.
 * This is crucial for handling large PRs without hitting LLM context limits.
 */
export const splitDiffIntoFiles = (fullDiff: string): string[] => {
    // Git diffs usually start with "diff --git a/..."
    const chunks = fullDiff.split('diff --git ');

    // The first element might be empty or preamble, filter it out if needed
    return chunks
        .filter(chunk => chunk.trim().length > 0)
        .map(chunk => `diff --git ${chunk}`); // Add the prefix back
};

/**
 * Groups file diffs into batches to respect token limits.
 * Simple strategy: Batch by count (e.g. 3 files per batch).
 * Advanced strategy: Token counting (omitted for MVP).
 */
export const batchDiffs = (fileDiffs: string[], batchSize: number = 3): string[] => {
    const batches: string[] = [];

    for (let i = 0; i < fileDiffs.length; i += batchSize) {
        const batch = fileDiffs.slice(i, i + batchSize);
        batches.push(batch.join('\n'));
    }

    return batches;
};
