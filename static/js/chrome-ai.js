async function generateAIPrompt() {
    try {
        const systemPrompt = `You are a thoughtful journaling assistant helping users with their "Homework for Life" practice. 
        Create reflective prompts that help users notice and appreciate meaningful moments in their daily lives. 
        Focus on personal growth, gratitude, and mindfulness.`;

        const response = await chrome.runtime.sendMessage({
            type: 'generateText',
            config: {
                systemPrompt: systemPrompt,
                userPrompt: "Generate a single, specific journaling prompt for today's reflection.",
                maxTokens: 50,
                temperature: 0.7
            }
        });

        return response?.text || null;
    } catch (error) {
        console.error('Chrome AI error:', error);
        return null;
    }
}
