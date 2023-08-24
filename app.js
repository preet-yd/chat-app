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
function handleSlashCommand(command, message) {
    if (command === '/help') {
        const helpMessage = `
            Available commands:
            /help - Display this help message
            /clear - Clear all messages
            /random - Generate a random number`;
        alert(helpMessage + "\n\nYour message: " + message);
    } else if (command === '/clear') {
        clearMessages();
    } else if (command === '/random') {
        const randomNumber = Math.floor(Math.random() * 100); // Generate a random number between 0 and 99
        displaySystemMessage(`Random number: ${randomNumber}`);
    } else {
        // Handle unknown command
        alert("Unknown command: " + command);
    }
}


function clearMessages() {
    messages.innerHTML = ''; // Clear all messages
}

function displaySystemMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('system-message');

    const messageWithoutCommand = message.replace(/^\s*\/\w+\s*/, '');

    messageElement.textContent = message;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
}


sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    
    // Check if the message is a slash command
    if (message.startsWith('/')) {
        handleSlashCommand(message); // Handle the command
    }
    if (message.trim() !== '') {
        const messageWithEmojis = replaceEmojis(message); // Replace emojis
        socket.emit('chatMessage', { username, message: messageWithEmojis });
        messageInput.value = ''; // Clear the input
    }
     else if (message.trim() !== '') {
        messageInput.value = ''; // Clear the input
        socket.emit('chatMessage', { username, message });
    }
});




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


// sendButton.addEventListener('click', () => {
//     let message = messageInput.value;
//     if (message.trim() !== '') {
//         message = replaceEmojis(message);
//         socket.emit('chatMessage', { username, message });
//         messageInput.value = '';
//     }
// });

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
