/**
 * Reference to the Firebase Database object
 */

const database = firebase.database().ref();

/**
 * References to the following elements:
 *      - div with id #all-messages
 *      - input with id #username
 *      - input with id #message
 */

const allMessages = document.getElementById('all-messages');
const usernameElem = document.getElementById('username');
const messageElem = document.getElementById('message');

/**
 * Reference to the sendBtn with onclick event listener updateDB
 */

const sendBtn = document.getElementById('send-btn');
sendBtn.onclick = updateDB;

function updateDB(event) {
  // Prevent default refresh
  event.preventDefault();

  // Create data object
  const data = {
    USERNAME: usernameElem.value,
    MESSAGE: messageElem.value,
  };

  // console.log the object
  console.log(data);

  // GET *PUSH* PUT DELETE
  // Write to our database
  database.push(data);

  // Reset message AND keep profile image the same
  messageElem.value = '';
}

/**
 * Add the addMessageToBoard function as an event
 * handler for the "child_added" event on the database
 * object
 */

database.on('child_added', addMessageToBoard);

function addMessageToBoard(rowData) {
  // Store the values of rowData inside object named 'data'
  const data = rowData.val();

  // console.log data
  console.log(data);

  // Create a variable named singleMessage
  // that stores function call for makeSingleMessageHTML()
  let singleMessage = makeSingleMessageHTML(data.USERNAME, data.MESSAGE);

  // Append the new message HTML element to allMessages
  allMessages.append(singleMessage);
}

function makeSingleMessageHTML(usernameTxt, messageTxt) {
  // Create Parent Div
  let parentDiv = document.createElement('div');
  // Add Class name .single-message
  parentDiv.className = 'single-message';

  // Create Username P Tag
  let usernameP = document.createElement('p');
  usernameP.className = 'single-message-username';
  usernameP.innerHTML = usernameTxt + ':';

  // Create message P Tag
  let messageP = document.createElement('p');
  messageP.innerHTML = messageTxt;

  parentDiv.append(usernameP, messageP);

  // Return Parent Div
  return parentDiv;
}

/**
 * @BONUS add an onkeyup event handler to the form HTML
 * element so the user can also submit the form with the
 * Enter key
 *
 * @BONUS use an arrow function
 *
 */

const handleEnterKey = (event) => {
  if (event.key === 'Enter') {
    updateDB(event);
  }
};

usernameElem.addEventListener('keydown', handleEnterKey);
messageElem.addEventListener('keydown', handleEnterKey);

/**
 * FOR INSTRUCTOR PURPOSES ONLY - CLEARING MESSAGES EVERY 30 MINUTES
 */
// Function to clear the chat messages (you don't need to teach this!)
function clearChat() {
  // Clear the Firebase database
  database
    .remove()
    .then(() => {
      // Clear the chat display
      allMessages.innerHTML = '';
      console.log('Chat messages cleared successfully.');
    })
    .catch((error) => {
      console.error('Error clearing chat messages:', error);
    });
}

// Set a timeout to clear chat messages after fifteen minutes (900000 milliseconds)
setTimeout(clearChat, 900000);
