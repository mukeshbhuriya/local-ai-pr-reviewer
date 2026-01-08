import { Request, Response } from 'express';
import { ReviewService } from '../services/review.service';
import { OpenAIService } from '../services/llm.service';

const llmService = new OpenAIService();
const reviewService = new ReviewService(llmService);

export const reviewPR = async (req: Request, res: Response) => {
    try {
        const { repo, prNumber, diff } = req.body;

        if (!diff) {
            console.warn(`[ReviewController] Rejected request: Missing diff content.`);
            return res.status(400).json({ error: 'Missing diff content' });
        }

        console.log(`[ReviewController] Received PR #${prNumber} for repo ${repo}. Analyzing...`);
        const result = await reviewService.review(repo, prNumber, diff);
        console.log(`[ReviewController] Analysis complete for PR #${prNumber}. Sending response.`);
        res.json(result);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
