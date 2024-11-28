document.addEventListener('DOMContentLoaded', function() {
    const promptDisplay = document.getElementById('prompt-display');
    const quoteDisplay = document.getElementById('quote-display');
    const newPromptBtn = document.getElementById('new-prompt-btn');
    const journalForm = document.getElementById('journal-form');
    const promptInput = document.getElementById('prompt-input');
    
    // Set default date to today
    document.getElementById('entry-date').valueAsDate = new Date();

    async function generatePrompt() {
        const aiStatus = document.getElementById('ai-status');
        try {
            // First try Chrome AI
            aiStatus.textContent = 'Checking AI...';
            aiStatus.className = 'badge bg-warning';
            
            const aiPrompt = await generateAIPrompt();
            if (aiPrompt) {
                currentPrompt = aiPrompt;
                aiStatus.textContent = 'Chrome AI';
                aiStatus.className = 'badge bg-success';
            } else {
                // Fallback to server prompts
                aiStatus.textContent = 'Server Prompts';
                aiStatus.className = 'badge bg-secondary';
                const response = await fetch('/generate_prompt');
                const data = await response.json();
                const randomIndex = Math.floor(Math.random() * data.prompts.length);
                currentPrompt = data.prompts[randomIndex];
            }
            promptDisplay.textContent = currentPrompt;
            promptInput.value = currentPrompt;
        } catch (error) {
            console.error('Error generating prompt:', error);
            aiStatus.textContent = 'Error';
            aiStatus.className = 'badge bg-danger';
            promptDisplay.textContent = "What made this moment meaningful to you?";
            promptInput.value = promptDisplay.textContent;
        }
    }

    newPromptBtn.addEventListener('click', generatePrompt);

    // Generate dynamic quote
    async function generateQuote() {
        const quoteDisplay = document.getElementById('quote-display');
        const quoteStatus = document.getElementById('quote-ai-status');
        
        try {
            quoteDisplay.textContent = ''; // Clear the quote while waiting
            quoteStatus.textContent = 'Checking AI...';
            quoteStatus.className = 'badge bg-warning';
            
            const aiQuote = await generateAIQuote();
            if (aiQuote) {
                quoteDisplay.textContent = aiQuote;
                quoteStatus.textContent = 'Chrome AI';
                quoteStatus.className = 'badge bg-success';
            } else {
                const response = await fetch('/generate_quote');
                const data = await response.json();
                const randomIndex = Math.floor(Math.random() * data.quotes.length);
                quoteDisplay.textContent = data.quotes[randomIndex];
                quoteStatus.textContent = 'Default Quote';
                quoteStatus.className = 'badge bg-secondary';
            }
        } catch (error) {
            console.error('Error generating quote:', error);
            quoteDisplay.textContent = ''; // Keep empty on error
            quoteStatus.textContent = 'Error';
            quoteStatus.className = 'badge bg-danger';
        }
    }

    // Form validation and submission
    journalForm.addEventListener('submit', function(e) {
        const content = document.getElementById('journal-content').value;
        const prompt = promptDisplay.textContent;
        
        if (!content.trim()) {
            e.preventDefault();
            alert('Please write something in your journal before saving.');
            return;
        }

        // Set the prompt input value before submission
        promptInput.value = prompt;
    });

    // Initialize toasts if they exist
    const toastElList = document.querySelectorAll('.toast');
    if (toastElList.length > 0) {
        toastElList.forEach(toastEl => {
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        });
    }

    // Generate initial quote and prompt
    generateQuote();
    generatePrompt();
});
