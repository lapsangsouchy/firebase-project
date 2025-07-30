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
 *  Add Reference to Profile Image Input
 */

const profileElem = document.getElementById('profile');

/**
 * Reference to the sendBtn with onclick event listener updateDB
 */

const sendBtn = document.getElementById('send-btn');
sendBtn.onclick = updateDB;

function updateDB(event) {
  // Prevent default refresh
  event.preventDefault();

  /* Time handling! */

  // Get the UNIX timestamp
  let now = new Date();

  console.log(now);

  //get the UNIX timestamp
  let timestamp = new Date().getTime();
  console.log('Now: ' + now);
  console.log('Timestamp: ' + timestamp);

  //extract the hours, minutes, and seconds
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  let year = now.getFullYear();
  let month = now.getMonth(); // this is the month but it starts with 0, so you have to add one when you are adding it to the database
  let day = now.getDate(); // This is the OG day

  console.log(hours, minutes, seconds, year, month, day);

  /* Profile Image Handling */

  // Create data object
  const data = {
    USERNAME: usernameElem.value,
    EMAIL: emailElem.value,
    MESSAGE: messageElem.value,
    TIMESTAMP: timestamp,
    HOURS: hours,
    MINUTES: minutes,
    SECONDS: seconds,
    YEAR: year,
    MONTH: ++month,
    DAY: day,
    PROFILE: profileElem.value,
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
    data.MESSAGE,
    data.TIMESTAMP,
    data.HOURS,
    data.MINUTES,
    data.SECONDS,
    data.YEAR,
    data.MONTH,
    data.DAY,
    data.PROFILE
  );

  // Append the new message HTML element to allMessages
  allMessages.append(singleMessage);
}

function makeSingleMessageHTML(
  usernameTxt,
  emailTxt,
  messageTxt,
  timestampTxt,
  hoursTxt,
  minutesTxt,
  secondsTxt,
  yearTxt,
  monthTxt,
  dayTxt,
  profileTxt
) {
  // Create Parent Div
  let parentDiv = document.createElement('div');
  // Add Class name .single-message
  parentDiv.className = 'single-message';

  /* DATE AND TIME ELEMENTS */

  // Create Date P Tag
  let dateP = document.createElement('p');
  // Add the date data to P tag
  dateP.innerHTML = `${monthTxt}/${dayTxt}/${yearTxt}`;
  // Add class name single-message-time to dateP
  dateP.className = 'single-message-time';

  // Create Time P Tag
  let timeP = document.createElement('p');
  // Add the time data to P tag
  timeP.innerHTML = `${hoursTxt}:${minutesTxt}:${secondsTxt}`;
  // Add class name single-message-time to timeP
  timeP.className = 'single-message-time';

  // Create Username P Tag
  let usernameP = document.createElement('p');
  usernameP.className = 'single-message-username';
  usernameP.innerHTML = usernameTxt + ':';

  /* EMAIL ELEMENT */
  // Create Email P Tag
  let emailP = document.createElement('p');
  emailP.className = 'single-message-email';
  emailP.innerHTML = emailTxt;

  /* NEW IMAGE ELEMENT */

  // Create Profile Img element
  let profileImg = document.createElement('img');
  // Add Class name single-message-img
  profileImg.className = 'single-message-img';
  // Add database URL to src
  profileImg.src = profileTxt;

  // Create message P Tag
  let messageP = document.createElement('p');
  messageP.innerHTML = messageTxt;

  parentDiv.append(profileImg, usernameP, emailP, messageP, dateP, timeP);

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

/* For Checking Images */

/**
 * You can actually check to see if an image that was uploaded is a valid image or not
 *
 * To do so, there's a nifty function someone wrote up as a solution
 * on Stackoverflow:
 *
 * You can add this function in your code:
 * 
 * function checkImage(imageSrc, good, bad) {
    var img = new Image();
    img.onload = good;
    img.onerror = bad;
    img.src = imageSrc;
  }
 *  
 * And it'll check if your image loads or causes an error
 * If the 'good' and 'bad' parameters can be functions that you use to return something
 * So if the image loads (onload) you can call a function that returns TRUE
 * If the image doesn't load (onerror) you can all a function that returns FALSE
 * 
 * That way, you can check in a conditional to see if the image is valid like so:
 * 
 * if (checkImage(profileElem.value, function () {return true;}, function () {return false;}))
 * 
 * 
 * 
*/
