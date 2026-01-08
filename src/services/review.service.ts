import { ILLMService } from '../interfaces/llm.interface';
import { SYSTEM_PROMPTS } from '../config/prompts';
import { splitDiffIntoFiles, batchDiffs } from '../utils/diff.utils';

export class ReviewService {
    constructor(private llmService: ILLMService) { }

    async review(repo: string, prNumber: number, diff: string): Promise<any> {

        // 1. Split diff into chunks to handle large PRs
        const fileDiffs = splitDiffIntoFiles(diff);
        // If no files detected (e.g. empty diff or diff without 'diff --git'), treat as one block
        const batches = batchDiffs(fileDiffs.length > 0 ? fileDiffs : [diff], 3);

        let allComments: any[] = [];
        let aggregatedSummary = "";

        console.log(`Processing PR #${prNumber} with ${fileDiffs.length} files in ${batches.length} batches.`);

        // 2. Process each batch
        for (const batchDiff of batches) {
            const prompt = `
          Repo: ${repo}
          PR #${prNumber} (Batch Analysis)
          Diff Chunk:
          ${batchDiff}
          
          Review this partial diff based on the system instructions.
        `;

            const result = await this.llmService.completeJson(prompt, SYSTEM_PROMPTS.PR_REVIEW);

            if (result && result.comments) {
                allComments = [...allComments, ...result.comments];
            }
            if (result && result.summary) {
                aggregatedSummary += result.summary + "\n";
            }
        }

        // 3. Return aggregated result
        return {
            summary: aggregatedSummary || "Review completed across multiple files.",
            comments: allComments
        };
    }
}
