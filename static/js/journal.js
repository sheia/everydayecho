document.addEventListener('DOMContentLoaded', function() {
    const promptDisplay = document.getElementById('prompt-display');
    const newPromptBtn = document.getElementById('new-prompt-btn');
    const journalForm = document.getElementById('journal-form');
    const promptInput = document.getElementById('prompt-input');
    
    let currentPrompt = '';

    async function generatePrompt() {
        try {
            // First try Chrome AI
            const aiPrompt = await generateAIPrompt();
            if (aiPrompt) {
                currentPrompt = aiPrompt;
            } else {
                // Fallback to server prompts
                const response = await fetch('/generate_prompt');
                const data = await response.json();
                const randomIndex = Math.floor(Math.random() * data.prompts.length);
                currentPrompt = data.prompts[randomIndex];
            }
            promptDisplay.textContent = currentPrompt;
            promptInput.value = currentPrompt;
        } catch (error) {
            console.error('Error generating prompt:', error);
            promptDisplay.textContent = "What's meaningful about today?";
            promptInput.value = promptDisplay.textContent;
        }
    }

    newPromptBtn.addEventListener('click', generatePrompt);

    // Generate initial prompt on page load
    generatePrompt();

    // Form validation
    journalForm.addEventListener('submit', function(e) {
        const content = document.getElementById('journal-content').value;
        if (!content.trim()) {
            e.preventDefault();
            alert('Please write something in your journal before saving.');
        }
    });
});
