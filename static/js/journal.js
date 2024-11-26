document.addEventListener('DOMContentLoaded', function() {
    const promptDisplay = document.getElementById('prompt-display');
    const newPromptBtn = document.getElementById('new-prompt-btn');
    const journalForm = document.getElementById('journal-form');
    const promptInput = document.getElementById('prompt-input');
    const savedNotification = document.getElementById('savedNotification');
    
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
            promptDisplay.textContent = "What's meaningful about today?";
            promptInput.value = promptDisplay.textContent;
        }
    }

    newPromptBtn.addEventListener('click', generatePrompt);

    // Generate initial prompt on page load
    generatePrompt();

    

    // Mood tracking toggle functionality
    const toggleMoodBtn = document.getElementById('toggleMood');
    const moodSection = document.getElementById('moodSection');
    const moodOptions = document.querySelectorAll('.mood-option');
    let selectedMood = null;

    if (toggleMoodBtn) {
        toggleMoodBtn.addEventListener('click', () => {
            moodSection.style.display = moodSection.style.display === 'none' ? 'block' : 'none';
        });
    }

    moodOptions.forEach(option => {
        option.addEventListener('click', () => {
            moodOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedMood = option.dataset.mood;
        });
    });

    // Form validation and submission
    journalForm.addEventListener('submit', function(e) {
        const content = document.getElementById('journal-content').value;
        
        if (!content.trim()) {
            e.preventDefault();
            alert('Please write something in your journal before saving.');
            return;
        }
    });

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