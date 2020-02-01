let myImage = document.querySelector('img');

myImage.onclick = function() {
	let mySrc = myImage.getAttribute('src');
	if (mySrc === 'images/javascript-logo.png') {
		myImage.setAttribute('src', 'images/javascript-logo2.png');
	} else {
		myImage.setAttribute('src', 'images/javascript-logo.png');
	}
};

let myButton = document.querySelector('button');
let myHeading = document.querySelector('h1');

function setUserName() {
	let myName = prompt('Please enter your name.');
	if (!myName) {
		setUserName();
	} else {
		localStorage.setItem('name', myName);
		myHeading.textContent = 'Javascript is cool, ' + myName;
	}
};

if (!localStorage.getItem('name') || localStorage.getItem('name') === "null") {
	setUserName();
} else {
	let storedName = localStorage.getItem('name');
	myHeading.textContent = 'Javascript is cool, ' + storedName;
}

myButton.onclick = function() {
	setUserName();
};