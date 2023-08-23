const socket = io();

const sidebar = document.getElementById('sidebar');
const usernamePopup = document.getElementById('usernamePopup');
const usernameInput = document.getElementById('usernameInput');
const usernameSubmit = document.getElementById('usernameSubmit');
const userList = document.getElementById('userList');
const users = document.getElementById('users');
const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

let username = '';

const emojiMap = {
    "happy": "😃",
    "sad": "😞",
    "XD": "😆",
    "xd": "😆",
    "like": "♡",
    "react": "⚛️",
    "woah" : "😮",
    "hey" : "👋",
    "lol" : "😂", 
    "congratulations" : "🎉",
    "congratulation" : "🎉"
};

function replaceEmojis(message) {
    for (const word in emojiMap) {
        if (emojiMap.hasOwnProperty(word)) {
            const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            message = message.replace(new RegExp(escapedWord, 'g'), emojiMap[word]);
        }
    }
    return message;
}

usernameSubmit.addEventListener('click', () => {
    let enteredUsername = usernameInput.value;  
    if (enteredUsername.trim() !== '') {
        username = enteredUsername;
        sidebar.removeChild(usernamePopup);
        userList.style.display = 'block';
        socket.emit('userConnected', username);
    }
});

socket.on('userConnected', (connectedUser) => {
    const userElement = document.createElement('li');
    userElement.textContent = connectedUser;
    users.appendChild(userElement);
});


sendButton.addEventListener('click', () => {
    let message = messageInput.value;
    if (message.trim() !== '') {
        message = replaceEmojis(message);
        socket.emit('chatMessage', { username, message });
        messageInput.value = '';
    }
});

socket.on('connect', () => {
    sendButton.disabled = false; // Enable the send button on connection
});

socket.on('chatMessage', (data) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = `${data.username}: ${data.message}`;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
});
