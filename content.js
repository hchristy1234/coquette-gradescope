// Function to hide all scores and add a button to reveal each one
function hideScores() {
    // Find all elements with the class 'submissionStatus--score'
    const scoreElements = document.querySelectorAll('.submissionStatus--score');
  
    // Loop through each score element
    scoreElements.forEach((scoreElement) => {
      // Create a button to reveal the score
      const revealButton = document.createElement('button');
      revealButton.textContent = 'Show Score';
      revealButton.classList.add('reveal-button');
  
      // Hide the score and replace it with the button
      scoreElement.style.display = 'none';
      scoreElement.parentNode.insertBefore(revealButton, scoreElement);
  
      // Add an event listener to the button to show the score when clicked
      revealButton.addEventListener('click', () => {
        scoreElement.style.display = 'block';
        revealButton.style.display = 'none';
      });
    });
  }
  
  // Run the function when the content script loads
  hideScores();
  