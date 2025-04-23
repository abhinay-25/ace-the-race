document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const companyName = urlParams.get('company');
    const companyTitle = document.getElementById('company-title');
    const questionsBody = document.getElementById('questions-body');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const questionCount = document.getElementById('question-count');
    const loading = document.getElementById('loading');

    if (!companyName) {
        window.location.href = '/';
        return;
    }

    // Set page title and company name
    document.title = `${companyName} Questions - Ace The Race`;
    companyTitle.textContent = `${companyName} Interview Questions`;

    // Function to fetch questions
    async function fetchQuestions(difficulty = '') {
        try {
            loading.style.display = 'flex';
            const url = `/api/company/${encodeURIComponent(companyName)}${difficulty ? `?difficulty=${difficulty}` : ''}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            return { questions: [] };
        } finally {
            loading.style.display = 'none';
        }
    }

    // Function to display questions
    function displayQuestions(questions) {
        if (!questions || questions.length === 0) {
            questionsBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No questions available for this company yet.</td>
                </tr>`;
            questionCount.textContent = 'No questions found';
            return;
        }

        questionCount.textContent = `${questions.length} questions found`;
        
        questionsBody.innerHTML = questions.map(q => `
            <tr>
                <td><a href="${q.leetcodeLink}" target="_blank" class="question-link">${q.title}</a></td>
                <td><span class="difficulty ${q.difficulty.toLowerCase()}">${q.difficulty}</span></td>
                <td>${q.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</td>
                <td><span class="frequency-indicator" title="Interview Frequency: ${q.frequency}%">${q.frequency}%</span></td>
                <td>${q.acceptanceRate || 'N/A'}%</td>
            </tr>
        `).join('');
    }

    // Initial load
    fetchQuestions().then(data => displayQuestions(data.questions));

    // Handle difficulty filter
    difficultyFilter.addEventListener('change', async () => {
        const questions = await fetchQuestions(difficultyFilter.value);
        displayQuestions(questions.questions);
    });
});