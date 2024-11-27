async function generateAIPrompt() {
    return await generateAIContent("Write one thought-provoking question that encourages users to do homework for life today. Only give the question, nothing more.");
}

async function generateAIQuote() {
    return await generateAIContent("Generate an inspiring quote about mindfulness, self-reflection, or the value of recording daily experiences. Keep it concise and impactful. Only return the quote, no attribution.");
}

async function generateAIContent(prompt) {
    try {
        console.log('Checking AI availability...');
        if (typeof ai === 'undefined') {
            console.log('Chrome AI is not available in this environment');
            return null;
        }
        const { available } = await ai.languageModel.capabilities();
        console.log('AI availability status:', available);
        if (available === "readily") {
            console.log('Creating AI session...');
            const session = await ai.languageModel.create({
                systemPrompt: "You are a guide who motivates the user to do homework for life. The Homework for Life concept encourages capturing one meaningful or storyworthy moment from each day to foster mindfulness and recognize life's significance. By recording these moments—typically brief notes—it creates a deeper connection with daily experiences, slowing down time and enriching life's narrative. This reflective practice can help preserve even the smallest, seemingly mundane moments as part of a personal history. The idea is particularly helpful during times of monotony or isolation, turning ordinary days into memorable ones.",
            });
            console.log('Generating content...');
            const result = await session.prompt(prompt);
            console.log('Generated content:', result);
            return result;
        }
        console.log('AI is not ready');
        return null;
    } catch (error) {
        console.error('Detailed Chrome AI error:', error);
        return null;
    }
}
