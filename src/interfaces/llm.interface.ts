export interface LLMResponse {
    content: string;
}

export interface ILLMService {
    complete(prompt: string, systemPrompt: string): Promise<string>;
    completeJson(prompt: string, systemPrompt: string): Promise<any>;
}
