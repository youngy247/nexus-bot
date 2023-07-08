import bot from '../assets/bot.svg';
import user from '../assets/user.svg';

export function ChatStripe(isAi, value, uniqueId) {
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
