var bigText = document.querySelector('.bigText');
var smallText = document.querySelector('.smallText');
var timer = document.querySelector('.timer');
var startButton = document.querySelector('.startBtn');


var quizArr = [];
var questionObj = {
    question: 'How do you link a Javascript file called script.js in your HTML?',
    answerSet: ['<script href="script.js">','<link href="script.js">', '<script src="script.js">', '<link src="script.js">'],
    correctIndex: 2
};
var timeLeft = 0;


startButton.addEventListener('click', function () {
    startGame();
})

function startGame() {
    //first, make the game description and start button go away
    smallText.style.display = 'none';
    startButton.style.display = 'none';
    timeLeft = 75;
    timer.textContent= timeLeft;
    let q = getQ() //where q is the questionObj and getQ grabs that object, in whatever form we choose to do so
    renderQuestion(q);
    countdownTimer = setInterval(function () {
        timeLeft = timeLeft - 1;
        timer.textContent = timeLeft;
    
        // game over if countdown reaches 0
        if (timeLeft <= 0) {
          endGame(0); //do all the things you need to do when the game ends. this might not actually end up staying in a funciton
        }
      }, 1000);
}

function renderQuestion(qObj) {
    bigText.textContent = qObj.question;
    let olEl = document.createElement("ol");
    olEl.setAttribute('type','A');
    let liEl;
    bigText.append(olEl);
    for (let x=0; x<qObj.answerSet.length; x++) {
        liEl = document.createElement("li");
        liEl.textContent = qObj.answerSet[x];
        liEl.setAttribute('class','listItem');
        olEl.appendChild(liEl);
    }
}

function getQ() {
    return questionObj;
}

function endGame(timeRemaining) {
    bigText.textContent = "You finished the quiz!";
    smallText.textContent = "Your final score was " + timeRemaining + "."
    smallText.style.display = 'initial';

    var formEl = document.createElement('form');
    var label = document.createElement('label');
    label.textContent = "Add your initials: ";
    var textBox = document.createElement('input');
    textBox.setAttribute('maxlength',8);
    textBox.setAttribute('required',true);
    var submitBtn = document.createElement('button');
    submitBtn.textContent = "Submit!"

    smallText.append(formEl)
    formEl.appendChild(label);
    label.appendChild(textBox)
    label.appendChild(submitBtn)


}