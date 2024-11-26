async function generateAIPrompt() {
    try {
        const { available } = await ai.languageModel.capabilities();
        if (available === "readily") {
            const session = await ai.languageModel.create({
                systemPrompt: "You are a guide who motivates the user to do homework for life. The Homework for Life concept encourages capturing one meaningful or storyworthy moment from each day to foster mindfulness and recognize life's significance. By recording these moments—typically brief notes—it creates a deeper connection with daily experiences, slowing down time and enriching life's narrative. This reflective practice can help preserve even the smallest, seemingly mundane moments as part of a personal history. The idea is particularly helpful during times of monotony or isolation, turning ordinary days into memorable ones.",
            });
            const result = await session.prompt(
                "Write one thought-provoking question that encourages users to do homework for life today. Only give the question, nothing more."
            );
            return result;
        }
        return null;
    } catch (error) {
        console.error('Chrome AI error:', error);
        return null;
    }
}
