import { Router } from 'express';
import { generateCode } from '../controllers/codegen.controller';
import { reviewPR } from '../controllers/review.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.post('/generate-code', generateCode);
router.post('/review-pr', reviewPR);

export default router;
