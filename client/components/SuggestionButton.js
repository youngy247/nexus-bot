export function generateSuggestionButtons(suggestions, form, ) {
    const suggestionContainer = document.querySelector('#suggestion_container');
    suggestionContainer.innerHTML = '';
  
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 768;
  
    const customLabels = {
      'Provide a list of sample questions to ask about Adam': 'Ask sample questions',
      "What are Adam's skills and technologies expertise?": isMobile ? 'Skills' : '1) Skills',
      "Can you provide details about Adam Young's experience at iO Academy's Full Stack Track bootcamp?": isMobile ? 'Bootcamp' : '2) Bootcamp',
      'What projects has Adam has done so far?': isMobile ? 'Projects' : '3) Projects',
      "What are Adam's hobbies and interests outside of software development?": isMobile ? 'Hobbies' : '4) Hobbies',
      'Can you provide a picture of Adam Young?': isMobile ? 'Picture' : '5) Picture',
    };
  
    suggestions.forEach((suggestion) => {
      const button = document.createElement('button');
      button.textContent = customLabels[suggestion] || suggestion;
      button.classList.add('suggestion');
      button.addEventListener('click', () => {
        const input = document.querySelector('textarea[name="prompt"]');
        input.value = suggestion;
        form.dispatchEvent(new Event('submit'));
      });
      suggestionContainer.appendChild(button);
    });
  }
  