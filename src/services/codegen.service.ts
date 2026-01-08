import { ILLMService } from '../interfaces/llm.interface';
import { SYSTEM_PROMPTS } from '../config/prompts';

export class CodegenService {
    constructor(private llmService: ILLMService) { }

    async generate(feature: string, stack: string, constraints: string[]): Promise<any> {
        const prompt = `
      Feature: ${feature}
      Stack: ${stack}
      Constraints: ${constraints.join(', ')}
      
      Generate the necessary code files and a brief explanation.
    `;

        return await this.llmService.completeJson(prompt, SYSTEM_PROMPTS.CODE_GEN);
    }
}
