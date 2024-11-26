document.addEventListener('DOMContentLoaded', function() {
    const promptDisplay = document.getElementById('prompt-display');
    const newPromptBtn = document.getElementById('new-prompt-btn');
    const journalForm = document.getElementById('journal-form');
    const promptInput = document.getElementById('prompt-input');
    const savedNotification = document.getElementById('savedNotification');
    
    // Mood selector functionality
    const moodOptions = document.querySelectorAll('.mood-option');
    const moodInput = document.getElementById('mood-input');
    let selectedMood = null;

    moodOptions.forEach(option => {
        option.addEventListener('click', () => {
            moodOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedMood = option.dataset.mood;
            moodInput.value = selectedMood;
        });
    });

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

    // Form validation and submission
    journalForm.addEventListener('submit', function(e) {
        const content = document.getElementById('journal-content').value;
        
        if (!content.trim()) {
            e.preventDefault();
            alert('Please write something in your journal before saving.');
            return;
        }

        if (!selectedMood) {
            e.preventDefault();
            alert('Please select how you\'re feeling today.');
            return;
        }
    });

    // History panel functionality
    const viewHistoryBtn = document.getElementById('viewHistoryBtn');
    const historyPanel = document.getElementById('historyPanel');
    const closeHistory = document.getElementById('closeHistory');

    if (viewHistoryBtn && historyPanel && closeHistory) {
        viewHistoryBtn.addEventListener('click', () => {
            historyPanel.classList.add('active');
        });

        closeHistory.addEventListener('click', () => {
            historyPanel.classList.remove('active');
        });
    }

    // Handle flash messages animation
    const flashMessages = document.querySelectorAll('.alert');
    flashMessages.forEach(message => {
        message.addEventListener('animationend', () => {
            setTimeout(() => {
                message.remove();
            }, 3000);
        });
    });
});
