import OpenAI from 'openai';
import { ILLMService } from '../interfaces/llm.interface';
import dotenv from 'dotenv';
dotenv.config();

export class OpenAIService implements ILLMService {
    private openai: OpenAI;
    private model: string;

    constructor() {
        // defaults: provider=openai
        const provider = process.env.LLM_PROVIDER || 'openai'; // 'openai' | 'ollama'

        // For Ollama, the API key is ignored but required by SDK. For OpenAI, it must be real.
        const apiKey = process.env.OPENAI_API_KEY || 'dummy-key';

        // Ollama URL usually http://localhost:11434/v1
        const baseURL = provider === 'ollama'
            ? (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434/v1')
            : undefined; // undefined lets OpenAI SDK use default

        // Determine model
        this.model = process.env.LLM_MODEL || (provider === 'ollama' ? 'llama3' : 'gpt-3.5-turbo');

        console.log(`[LLM Service] Initialized. Provider: ${provider}, Model: ${this.model}`);
        if (baseURL) console.log(`[LLM Service] Base URL: ${baseURL}`);

        this.openai = new OpenAI({
            apiKey: apiKey,
            baseURL: baseURL,
        });
    }

    async complete(prompt: string, systemPrompt: string): Promise<string> {
        try {
            // Mock Check: Only if using OpenAI and no key is present
            if (process.env.LLM_PROVIDER !== 'ollama' && !process.env.OPENAI_API_KEY) {
                console.warn('OPENAI_API_KEY is not set. Returning mock response.');
                return 'Mock response: API key missing.';
            }

            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.2,
            });

            return response.choices[0].message.content || '';
        } catch (error) {
            console.error('LLM Service Error:', error);
            throw new Error('Failed to complete request to LLM provider');
        }
    }

    async completeJson(prompt: string, systemPrompt: string): Promise<any> {
        try {
            // Mock Check: Only if using OpenAI and no key is present
            if (process.env.LLM_PROVIDER !== 'ollama' && !process.env.OPENAI_API_KEY) {
                if (systemPrompt.includes("generate production-ready code")) {
                    return {
                        files: [
                            { path: "src/example.ts", content: "console.log('Hello World');" }
                        ],
                        explanation: "Mock code generation successful."
                    };
                }
                // Default to Review Mock
                return {
                    summary: "Mock Review: No API Key provided.",
                    comments: [
                        { file: "src/auth.ts", line: 10, severity: "BLOCKER", issue: "Hardcoded secret", suggestion: "Use env vars" }
                    ]
                };
            }

            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0.2,
            });

            const content = response.choices[0].message.content;
            if (!content) return null;

            return JSON.parse(content);
        } catch (error) {
            console.error('LLM JSON Service Error:', error);
            throw new Error('Failed to get JSON response from LLM');
        }
    }
}
