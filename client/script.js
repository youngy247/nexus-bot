import bot from './assets/bot.svg';
import user from  './assets/user.svg';
import DOMPurify from 'dompurify';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
    element.textContent = '';

    loadInterval = setInterval(() => {
        element.textContent += '.';

        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300)
}

function typeText(element, text) {
  let index = 0;
  let instantRender = false;

  if (text.includes('<img')) {
    instantRender = true;
  }

  let interval = setInterval(() => {
    if (index < text.length) {
      setTimeout(() => {
        if (instantRender) {
          // Render the entire text instantly if an <img> tag is found
          element.innerHTML = text;
          clearInterval(interval);
        } else if (text[index] === '<' && ['a','h',].includes(text[index + 1])) {
          const closingIndex = findClosingTagIndex(text, index);
          element.innerHTML = text.substring(0, closingIndex);
      
          const indexIncrease = closingIndex - index + 1;
          index += indexIncrease
      } else {
        element.innerHTML = text.substring(0, index + 1);
        index++;
      }
      }, 10);
    } else {
      clearInterval(interval);
    }
  }, 15);
}

function findClosingTagIndex(inputString, startIndex) {
  // Ensuring that we start at a valid <a> tag
  if (inputString.substr(startIndex, 2) !== "<a" && inputString.substr(startIndex, 2) !== "<h") {
      throw new Error("startIndex does not point to an <a> tag.");
  }

  // Initialize a counter to keep track of '>' characters
  let gtCounter = 0;

  for (let i = startIndex; i < inputString.length; i++) {
      if (inputString[i] === '>') {
          gtCounter++;
      }

      // If we've found the second '>', return its index
      if (gtCounter === 2) {
          return i;
      }
  }

  // If we didn't find two '>' characters, the string is not well-formed HTML
  throw new Error("The input string does not contain well-formed HTML.");
}

  

function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id=${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId){
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                        src="${isAi ? bot : user}"
                        alt="${isAi ? 'bot' : 'user'}"
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
        `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    // user's chat
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

    form.reset();

    // bot's chat
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, "", uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    // fetch data from server -> bot's response

    const response = await fetch('https://nexus-bnue.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/html'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    const customPolicy = {
      ALLOWED_TAGS: ['a', 'p', 'h2', 'ul', 'li'],
      ALLOWED_ATTR: ['href', 'target'],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-]|$))/i,
      ADD_ATTR: [['target', '_blank']],
    };

    function sanitizeHTML(html) {
      return DOMPurify.sanitize(html, { ADD_TAGS: ['a'], ADD_ATTR: ['target'], ...customPolicy });
    }

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

   if(response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim(); // Sanitize the bot's response
        const sanitizedResponse = sanitizeHTML(parsedData);

        typeText(messageDiv, sanitizedResponse)

    } else if (response.status === 429){
        const err = await response.text()

        messageDiv.innerHTML = err

        console.log(err);
    } 
    else {
        messageDiv.innerHTML = 'An error occured'
    }
}

async function fetchInitialGreeting() {
    try {
      const response = await fetch('https://nexus-bnue.onrender.com');
      if (response.ok) {
        const data = await response.json();
        const initialGreeting = data.bot.trim();
        const uniqueId = generateUniqueId();
        chatContainer.innerHTML += chatStripe(true, "", uniqueId);
        const messageDiv = document.getElementById(uniqueId);
        typeText(messageDiv, initialGreeting);
      } else {
        throw new Error('Failed to fetch initial greeting from the server');
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  // Call the fetchInitialGreeting function when the page loads
  window.addEventListener('DOMContentLoaded', fetchInitialGreeting);

form.addEventListener('submit', handleSubmit);
form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleSubmit(e);
    }
}
)
