document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatIcon = document.getElementById('chatbot-icon');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const submitBtn = chatForm.querySelector('button[type="submit"]');

    let isOpen = false;
    let hasInitialized = false;

    // Backend API URL
    const API_URL = 'http://localhost:8000/chat';

    // Toggle Chat Function
    const toggleChat = () => {
        isOpen = !isOpen;
        if (isOpen) {
            chatbotWindow.classList.remove('scale-0', 'opacity-0', 'pointer-events-none');
            chatbotWindow.classList.add('scale-100', 'opacity-100', 'pointer-events-auto');
            chatIcon.classList.remove('fa-comment-dots');
            chatIcon.classList.add('fa-chevron-down');

            if (!hasInitialized) {
                addBotMessage("Hello! I'm the College Assistant. Ask me anything about courses, admissions, facilities, or campus life.");
                addDefaultQuestions([
                    "What are the fees?",
                    "How to apply?",
                    "What courses do you offer?",
                    "Are there scholarships?"
                ]);
                hasInitialized = true;
            }
            // Add a small delay for focusing the input to allow animation to complete
            setTimeout(() => chatInput.focus(), 300);
        } else {
            chatbotWindow.classList.remove('scale-100', 'opacity-100', 'pointer-events-auto');
            chatbotWindow.classList.add('scale-0', 'opacity-0', 'pointer-events-none');
            chatIcon.classList.remove('fa-chevron-down');
            chatIcon.classList.add('fa-comment-dots');
        }
    };

    chatbotToggle.addEventListener('click', toggleChat);
    chatbotClose.addEventListener('click', toggleChat);

    // Render User Message
    const addUserMessage = (text) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'self-end max-w-[85%] animate-fade-in flex flex-col items-end';

        const bubble = document.createElement('div');
        bubble.className = 'bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 text-sm shadow-sm break-words';
        bubble.textContent = text;

        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    };

    // Render Bot Message
    const addBotMessage = (text) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'self-start max-w-[85%] animate-fade-in flex gap-2';

        const avatar = document.createElement('div');
        avatar.className = 'w-6 h-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-1';
        avatar.innerHTML = '<i class="fa-solid fa-robot text-blue-600 text-xs"></i>';

        const bubble = document.createElement('div');
        bubble.className = 'bg-white text-gray-700 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-2 text-sm shadow-sm break-words leading-relaxed';

        // Handle basic formatting (like bullet points or bold text if any)
        // For security, if parsing markdown we should use a library, but for now we insert as plain text or simple formatting.
        // We will just use textContent to avoid XSS.
        bubble.textContent = text;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    };

    // Render Default Questions
    const addDefaultQuestions = (questions) => {
        const container = document.createElement('div');
        container.className = 'w-full flex flex-wrap gap-2 mt-2 pl-8 animate-fade-in';

        questions.forEach(q => {
            const btn = document.createElement('button');
            btn.className = 'bg-white border text-left border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 text-xs px-3 py-1.5 rounded-2xl transition-colors shadow-sm';
            btn.textContent = q;
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                sendMessage(q);
                // Hide options after clicking one
                container.style.display = 'none';
            });
            container.appendChild(btn);
        });

        chatMessages.appendChild(container);
        scrollToBottom();
    };

    // Render Typing Indicator
    const showTypingIndicator = () => {
        const messageDiv = document.createElement('div');
        messageDiv.id = 'typing-indicator';
        messageDiv.className = 'self-start max-w-[85%] animate-fade-in flex gap-2';

        const avatar = document.createElement('div');
        avatar.className = 'w-6 h-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-1';
        avatar.innerHTML = '<i class="fa-solid fa-robot text-blue-600 text-xs"></i>';

        const bubble = document.createElement('div');
        bubble.className = 'bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1';
        bubble.innerHTML = `
            <div class="typing-indicator flex items-center">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    };

    const removeTypingIndicator = () => {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    };

    const scrollToBottom = () => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const sendMessage = async (userInput) => {
        // Display user message
        addUserMessage(userInput);
        chatInput.value = '';

        // Disable input while waiting
        chatInput.disabled = true;
        submitBtn.disabled = true;

        showTypingIndicator();

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: userInput })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            removeTypingIndicator();

            if (data && data.answer) {
                addBotMessage(data.answer);
            } else {
                addBotMessage("Sorry, I received an unexpected response format.");
            }

        } catch (error) {
            console.error('Error fetching response:', error);
            removeTypingIndicator();
            addBotMessage("Sorry, I'm having trouble connecting to the server. Please ensure the backend is running and try again.");
        } finally {
            chatInput.disabled = false;
            submitBtn.disabled = false;
            chatInput.focus();
        }
    };

    // Handle form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userInput = chatInput.value.trim();
        if (!userInput) return;

        await sendMessage(userInput);
    });
});
