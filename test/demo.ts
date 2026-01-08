
import { CodegenService } from '../src/services/codegen.service';
import { ReviewService } from '../src/services/review.service';
import { OpenAIService } from '../src/services/llm.service';

const runDemo = async () => {
    console.log('🚀 Starting MVP Demo...\n');

    const llmService = new OpenAIService();
    const codegenService = new CodegenService(llmService);
    const reviewService = new ReviewService(llmService);

    // 1. Test Code Gen
    console.log('--- TEST 1: Code Generation ---');
    try {
        const feature = "User Login API";
        const stack = "Node.js";
        console.log(`Requesting: ${feature} on ${stack}`);

        // Note: Without a real API key, this might return a mock or error depending on implementation
        if (!process.env.OPENAI_API_KEY) {
            console.log('NOTE: No OPENAI_API_KEY set. Expecting Mock Response.');
        }

        const codeResult = await codegenService.generate(feature, stack, ["secure"]);
        console.log('Result:', JSON.stringify(codeResult, null, 2));
    } catch (e: any) {
        console.error('Code Gen Failed:', e.message);
    }

    console.log('\n--- TEST 2: PR Review ---');
    try {
        const mockDiff = `
diff --git a/src/auth.ts b/src/auth.ts
index 123..456 100644
--- a/src/auth.ts
+++ b/src/auth.ts
@@ -10,1 +10,1 @@
- const token = process.env.TOKEN;
+ const token = "hardcoded_secret_value"; // TODO: remove this
`;
        console.log('Analyzing Diff...');
        const reviewResult = await reviewService.review('test/repo', 1, mockDiff);
        console.log('Review Result:', JSON.stringify(reviewResult, null, 2));
    } catch (e: any) {
        console.error('PR Review Failed:', e.message);
    }
};

runDemo();
