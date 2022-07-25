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
    timeLeft = 15;
    timer.textContent= timeLeft;
    let q = getQ() //where q is the questionObj and getQ grabs that object, in whatever form we choose to do so
    renderQuestion(q);
    countdownTimer = setInterval(function () {
        timeLeft = timeLeft - 1;
        timer.textContent = timeLeft;
        // game over if countdown reaches 0
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            timeLeft = 0;
          endGame(0); //do all the things you need to do when the game ends. this might not actually end up staying in a funciton
        }
      }, 1000);

      //listen for clicks to list items
      document.addEventListener('click', function (event) {
        if (!countdownTimer) {return}; //checks to see whether the game is running. if not, do nothing
        //did we click one of the options? then do something.
        if (event.target.matches('li')) { 
            //render the next question if we have any remaining (gotta add an if for that)
            q=getQ();
            renderQuestion(q);
            var selectedOption = event.target.getAttribute('data-index');
            var answer = document.querySelector('.answer');
            //perform actions based on whether we answered right or wrong
            if (selectedOption != q.correctIndex) {
                timeLeft=timeLeft-10;
                answer.textContent ='---Wrong!---'
            }
            else {
                answer.textContent = '---Correct!---'
            }
        }
    })
}

function renderQuestion(qObj) {
    //set the header text to the question 
    bigText.textContent = qObj.question;
    let olEl = document.createElement("ol");
    olEl.setAttribute('type','A');
    let liEl;
    bigText.append(olEl);
    //we've added the ol element, now add all the list items (answer options)
    for (let x=0; x<qObj.answerSet.length; x++) {
        liEl = document.createElement("li");
        liEl.textContent = qObj.answerSet[x];
        liEl.setAttribute('class','listItem');
        liEl.setAttribute('data-index',x);
        liEl.style.cursor = 'pointer';
        olEl.appendChild(liEl);
    }
    //add an element to (later, if this is the first question) show whether your answer was right. by default, this is empty
    var answer = document.createElement("p");
    answer.setAttribute('class','answer');
    document.querySelector('main').lastElementChild.append(answer)
}

function getQ() {
    return questionObj;
}

function endGame(timeRemaining) {
    //get rid of the right/wrong line:
    document.querySelector('.answer').textContent='';

    //display text
    bigText.textContent = "You finished the quiz!";
    smallText.textContent = "Your final score was " + timeRemaining + "."
    smallText.style.display = '';

    //make form. yes this is very ugly no i do not know how else to do it without just doing it in HTML
    var formEl = document.createElement('form');
    formEl.style.text-align('center');
    var label = document.createElement('label');
    label.textContent = "Add your initials: ";
    var textBox = document.createElement('input');
    textBox.setAttribute('maxlength',8);
    textBox.setAttribute('required',true);
    textBox.setAttribute('name','initials');
    var submitBtn = document.createElement('button');
    submitBtn.textContent = "Submit!"
    smallText.insertAdjacentElement('afterend',formEl)
    formEl.appendChild(label);
    label.appendChild(textBox)
    label.appendChild(submitBtn)
}

/*
form.addEventListener('submit', function (event) {
    //HOW do i target input rather than form
    var initials = event.value; //this would work if event was toggling on input, but not in total. submission form somehow??? who knows if this will work
    initials=initials.toUpperCase();
    localStorage.getItem(initials,score);
})*/
