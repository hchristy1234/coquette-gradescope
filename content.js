const defaults = {
    shapes: ["star"],
    colors: ["D49BC9", "E19AC1", "ED8EB6", "F08CB3", "DFA1C5", "fffcd2"],
  };
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
            const rect = revealButton.getBoundingClientRect();
            console.log(rect.left/rect.width);
            console.log(rect.top/rect.height);
            scoreElement.style.display = 'block';
            revealButton.style.display = 'none';
  
            // Trigger confetti effect from the button's position
            console.log(rect.bottom);
            confetti({
                ...defaults,
                startVelocity: 25,
                spread: 60,
                ticks: 60,
                gravity: 0.8,
                origin: {x:rect.right/window.innerWidth-0.05 , y:rect.bottom/(window.innerHeight+window.scrollY+0.03)}

            });
        });
    });
  }
  
  // Run the function when the content script loads
  hideScores();  