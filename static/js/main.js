document.getElementById('codeFile').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || 'No file chosen';
    document.getElementById('fileName').textContent = fileName;
});

document.getElementById('codeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('codeFile');
    const submitButton = document.querySelector('.analyze-btn');
    const loader = document.querySelector('.loader');
    const btnText = document.querySelector('.btn-text');

    if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select a file');
        return;
    }

    // Show loading state
    loader.classList.remove('hidden');
    btnText.textContent = 'Analyzing...';
    submitButton.disabled = true;

    const formData = new FormData();
    formData.append('code_file', fileInput.files[0]);

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            displayResults(result);
        } else {
            alert(result.error || 'Error analyzing code');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error analyzing code. Please try again.');
    } finally {
        // Reset loading state
        loader.classList.add('hidden');
        btnText.textContent = 'Analyze Code';
        submitButton.disabled = false;
    }
});

function displayResults(result) {
    document.getElementById('results').classList.remove('hidden');
    
    // Update total score
    document.getElementById('totalScore').textContent = result.total_score;

    // Update score bars
    updateScoreBar('efficiency', result.breakdown.efficiency);
    updateScoreBar('readability', result.breakdown.readability);
    updateScoreBar('security', result.breakdown.security);
    updateScoreBar('complexity', result.breakdown.complexity);
    updateScoreBar('errorHandling', result.breakdown.error_handling);

    // Update suggestions
    const suggestionsList = document.getElementById('suggestionsList');
    suggestionsList.innerHTML = '';
    result.suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        suggestionsList.appendChild(li);
    });
}

function updateScoreBar(metric, score) {
    const bar = document.getElementById(`${metric}Bar`);
    const scoreElement = document.getElementById(`${metric}Score`);
    bar.style.width = `${score}%`;
    scoreElement.textContent = score;
}
