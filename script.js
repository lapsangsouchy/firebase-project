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
 *  Add Reference to Email Input
 */

const emailElem = document.getElementById('email');

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
    EMAIL: emailElem.value,
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
  let singleMessage = makeSingleMessageHTML(
    data.USERNAME,
    data.EMAIL,
    data.MESSAGE
  );

  // Append the new message HTML element to allMessages
  allMessages.append(singleMessage);
}

function makeSingleMessageHTML(usernameTxt, emailTxt, messageTxt) {
  // Create Parent Div
  let parentDiv = document.createElement('div');
  // Add Class name .single-message
  parentDiv.className = 'single-message';

  // Create Username P Tag
  let usernameP = document.createElement('p');
  usernameP.className = 'single-message-username';
  usernameP.innerHTML = usernameTxt + ':';

  /* EMAIL ELEMENT */
  // Create Email P Tag
  let emailP = document.createElement('p');
  emailP.className = 'single-message-email';
  emailP.innerHTML = emailTxt;

  // Create message P Tag
  let messageP = document.createElement('p');
  messageP.innerHTML = messageTxt;

  parentDiv.append(usernameP, emailP, messageP);

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
emailElem.addEventListener('keydown', handleEnterKey);
