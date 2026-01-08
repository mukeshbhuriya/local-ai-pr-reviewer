import { Request, Response } from 'express';
import { CodegenService } from '../services/codegen.service';
import { OpenAIService } from '../services/llm.service';

const llmService = new OpenAIService();
const codegenService = new CodegenService(llmService);

export const generateCode = async (req: Request, res: Response) => {
    try {
        const { feature, stack, constraints } = req.body;

        if (!feature || !stack) {
            return res.status(400).json({ error: 'Missing feature or stack' });
        }

        const result = await codegenService.generate(feature, stack, constraints || []);
        res.json(result);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
